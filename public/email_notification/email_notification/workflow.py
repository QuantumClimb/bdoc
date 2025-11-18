import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging
import psycopg2
from psycopg2.extras import RealDictCursor
from decimal import Decimal

from datetime import datetime, timezone
from datetime import datetime, timezone
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging


# Import logger from unifycode
try:
    from unifycode import logger
except ImportError:
    # Create a fallback logger if import fails
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    logger = logging.getLogger(__name__)

# Use the same DB connection function from unifycode.py
def get_db_connection():
    from unifycode import get_db_connection as original_get_db_connection
    return original_get_db_connection()

# 🔥 WORKFLOW FUNCTIONS - Enhanced to work with pending changes

def check_approval_workflow(invoice_amount, invoice_number, supplier_name, user_id=1):
    """
    Check which approval level is needed based on amount
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT level_name, approver_name, approver_email 
            FROM "DocAI".approval_hierarchy 
            WHERE %s BETWEEN min_amount AND max_amount
            ORDER BY min_amount
            LIMIT 1
        """, (invoice_amount,))
        
        result = cur.fetchone()
        cur.close()
        conn.close()
        
        if result:
            logger.info(f"🔄 WORKFLOW: Invoice {invoice_number} (Amount: {invoice_amount}) needs {result['level_name']} approval - {result['approver_name']}")
            return result
        else:
            logger.warning(f"⚠️ No approval hierarchy found for amount: {invoice_amount}")
            return None
            
    except Exception as e:
        logger.error(f"❌ Workflow check failed: {e}")
        return None

def create_workflow_audit(invoice_number, original_amount, changed_amount, approver_level, approver_email, approver_name, user_id=1):
    """
    Create audit entry in workflow_audit_log
    """
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO "DocAI".workflow_audit_log 
            (invoice_number, original_amount, changed_amount, current_approver_level, 
             current_approver_email, status, change_requested_by)
            VALUES (%s, %s, %s, %s, %s, 'pending', %s)
            RETURNING id
        """, (invoice_number, original_amount, changed_amount, approver_level, approver_email, f"user_{user_id}"))
        
        audit_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        logger.info(f"📝 Workflow audit created for {invoice_number} (Audit ID: {audit_id})")
        return audit_id
        
    except Exception as e:
        logger.error(f"❌ Workflow audit creation failed: {e}")
        return None

def should_trigger_workflow(invoice_amount, invoice_number):
    """
    Basic check to see if workflow should be triggered
    For now, we'll trigger for any amount change, but later we can add conditions
    """
    if invoice_amount is None:
        return False
    
    try:
        # Convert to Decimal for proper comparison
        amount = Decimal(str(invoice_amount))
        # Trigger workflow for any amount (we'll add conditions later)
        return True
    except:
        return False

def get_temporary_approver(invoice_amount):
    """
    Temporary function until we have data in approval_hierarchy table
    """
    amount = Decimal(str(invoice_amount))
    if amount <= 5000:
        return "L1", "Temporary Approver L1", "approverl1bee@gmail.com"
    elif amount <= 20000:
        return "L2", "Temporary Approver L2", "mrupatil333@gmail.com"
    else:
        return "L3", "Temporary Approver L3", "beeat2024@gmail.com"

# 🔥 ENHANCED: Function to get pending changes for email content
def get_pending_changes_for_email(invoice_number):
    """
    Get pending changes from history tables for email content
    """
    try:
        from unifycode import get_pending_changes_from_history
        pending_changes = get_pending_changes_from_history(invoice_number)
        
        if pending_changes and (pending_changes.get("header_changes") or pending_changes.get("line_changes")):
            logger.info(f"📊 Found pending changes for email: {invoice_number}")
            return pending_changes
        else:
            logger.info(f"ℹ️ No pending changes found for email: {invoice_number}")
            return None
            
    except Exception as e:
        logger.error(f"❌ Error getting pending changes for email: {e}")
        return None

def send_approval_email(invoice_number, invoice_amount, approver_email, approver_name, audit_id, changes=None):
    """
    🔥 ENHANCED: Send approval request email with change diffs from pending changes
    """
    try:
        # Email configuration
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', 587))
        sender_email = os.getenv('SMTP_USER', '')
        sender_password = os.getenv('SMTP_PASSWORD', '')
        
        print(f"🔧 SMTP Configuration:")
        print(f"   Server: {smtp_server}:{smtp_port}")
        print(f"   From: {sender_email}")
        print(f"   To: {approver_email}")
        print(f"   Password: {'*' * len(sender_password) if sender_password else 'Not set'}")
        
        # Validate that we have email credentials
        if not sender_email or not sender_password:
            error_msg = "❌ Email credentials not configured"
            print(error_msg)
            logger.error(error_msg)
            return False
        
        if 'example.com' in sender_email or 'your-email' in sender_email:
            error_msg = "❌ Please update SMTP_USER with your actual email address"
            print(error_msg)
            logger.error(error_msg)
            return False

        # 🔥 FIX: Handle both string changes and structured changes
        email_changes = changes
        if not email_changes:
            email_changes = get_pending_changes_for_email(invoice_number)
            if email_changes:
                print(f"📧 Using pending changes from history for email content")
            else:
                print(f"ℹ️ No pending changes found, using basic email")
        elif isinstance(email_changes, str):
            # 🔥 FIX: Convert string changes to proper structure
            print(f"📧 Converting string changes to structured format")
            email_changes = {"notes": email_changes}
        
        # Ensure email_changes is always a dictionary
        if not email_changes:
            email_changes = {"notes": "No changes specified"}
        elif not isinstance(email_changes, dict):
            print(f"⚠️ Unexpected changes type: {type(email_changes)}, converting to dict")
            email_changes = {"notes": str(email_changes)}

        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = approver_email
        
        # Format amount with commas
        formatted_amount = f"{invoice_amount:,.2f}"
        msg['Subject'] = f'APPROVAL REQUIRED: Invoice #{invoice_number} - Amount: ₹{formatted_amount}'
        
        # Generate action URLs
        base_url = "http://127.0.0.1:8000"
        approve_url = f"{base_url}/api/workflow/action?audit_id={audit_id}&action=approve"
        reject_url = f"{base_url}/api/workflow/action?audit_id={audit_id}&action=reject"
        request_edit_url = f"{base_url}/api/workflow/action?audit_id={audit_id}&action=request_edit"
        
        # 🔥 ENHANCED: Create HTML email body with change diffs section
        html_content = generate_approval_email_html(
            invoice_number=invoice_number,
            formatted_amount=formatted_amount,
            audit_id=audit_id,
            approver_name=approver_name,
            approver_email=approver_email,
            approver_level="",  # Will be filled from approver info
            changes=email_changes,
            approve_url=approve_url,
            reject_url=reject_url,
            request_edit_url=request_edit_url
        )
        
        # Create both HTML and plain text versions
        msg.attach(MIMEText(html_content, 'html'))
        
        # Also include plain text version for email clients that don't support HTML
        plain_text = generate_approval_email_plain_text(
            invoice_number=invoice_number,
            formatted_amount=formatted_amount,
            audit_id=audit_id,
            approver_name=approver_name,
            changes=email_changes,
            approve_url=approve_url,
            reject_url=reject_url,
            request_edit_url=request_edit_url
        )
        msg.attach(MIMEText(plain_text, 'plain'))
        
        # Send email with detailed error handling
        print(f"🔗 Connecting to SMTP server: {smtp_server}:{smtp_port}")
        try:
            server = smtplib.SMTP(smtp_server, smtp_port, timeout=15)
            print("✅ Connected to SMTP server")
        except Exception as e:
            print(f"❌ Failed to connect to SMTP server: {e}")
            return False
            
        try:
            server.starttls()
            print("✅ TLS started")
        except Exception as e:
            print(f"❌ Failed to start TLS: {e}")
            server.quit()
            return False
            
        try:
            print("🔐 Attempting to login...")
            server.login(sender_email, sender_password)
            print("✅ Logged in successfully")
        except smtplib.SMTPAuthenticationError as e:
            print(f"❌ SMTP Authentication failed: {e}")
            print("💡 For Gmail, make sure:")
            print("   - You're using an App Password (not your regular password)")
            print("   - 2-Factor Authentication is enabled")
            print("   - You've generated a 16-character App Password")
            server.quit()
            return False
        except Exception as e:
            print(f"❌ Login failed: {e}")
            server.quit()
            return False
            
        try:
            print("📤 Sending email...")
            server.send_message(msg)
            print("✅ HTML email sent successfully!")
            server.quit()
            return True
        except smtplib.SMTPRecipientsRefused as e:
            print(f"❌ Recipient refused: {approver_email}")
            print(f"   Error: {e}")
            server.quit()
            return False
        except smtplib.SMTPException as e:
            print(f"❌ SMTP error while sending: {e}")
            server.quit()
            return False
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            server.quit()
            return False
        
    except Exception as e:
        logger.error(f"❌ Unexpected error in send_approval_email: {e}")
        print(f"❌ Unexpected error: {e}")
        return False

# 🔥 NEW: Function to generate HTML email with change diffs
def generate_approval_email_html(invoice_number, formatted_amount, audit_id, approver_name, 
                               approver_email, approver_level, changes, approve_url, 
                               reject_url, request_edit_url):
    """
    Generate HTML email content with change diffs section + Check Invoice button
    """
    
    # Generate the invoice viewing URL
    base_url = "http://127.0.0.1:8000"  # Your server URL
    invoice_view_url = f"{base_url}/invoice-view/{invoice_number}"
    
    # 🔥 ENHANCED: Generate changes summary HTML if changes exist
    changes_html = ""
    if changes and (changes.get("header_changes") or changes.get("line_changes")):
        changes_html = generate_changes_summary_html(changes)
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice Approval Required</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                text-align: center;
            }}
            .content {{
                background: #f8f9fa;
                padding: 25px;
                border-radius: 0 0 10px 10px;
            }}
            .invoice-details {{
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .detail-row {{
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }}
            .detail-label {{
                font-weight: 600;
                color: #555;
            }}
            .detail-value {{
                color: #333;
                font-weight: 500;
            }}
            .action-buttons {{
                text-align: center;
                margin: 30px 0;
            }}
            .btn {{
                display: inline-block;
                padding: 12px 24px;
                margin: 0 10px;
                border: none;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
            }}
            .btn-approve {{
                background: #28a745;
                color: white;
            }}
            .btn-reject {{
                background: #dc3545;
                color: white;
            }}
            .btn-edit {{
                background: #ffc107;
                color: #212529;
            }}
            .btn-view {{
                background: #17a2b8;
                color: white;
            }}
            .btn:hover {{
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
                font-size: 12px;
            }}
            .changes-section {{
                background: #fff3cd;
                padding: 15px;
                border-radius: 6px;
                margin: 15px 0;
                border-left: 4px solid #ffc107;
            }}
            .audit-info {{
                background: #e7f3ff;
                padding: 15px;
                border-radius: 6px;
                margin: 15px 0;
                border-left: 4px solid #007bff;
            }}
            .view-invoice-section {{
                background: #d4edda;
                padding: 15px;
                border-radius: 6px;
                margin: 15px 0;
                border-left: 4px solid #28a745;
                text-align: center;
            }}
            /* 🔥 NEW: Changes table styles */
            .changes-table {{
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
            }}
            .changes-table tr {{
                border-bottom: 1px solid #e9ecef;
            }}
            .changes-table td {{
                padding: 8px;
                vertical-align: top;
            }}
            .change-field {{
                font-weight: 600;
                width: 30%;
                color: #495057;
            }}
            .change-arrow {{
                text-align: center;
                width: 10%;
                color: #6c757d;
                font-weight: bold;
            }}
            .change-new {{
                width: 60%;
                color: #28a745;
                font-weight: 500;
            }}
            .changes-group {{
                margin-bottom: 20px;
            }}
            .changes-group h4 {{
                margin: 0 0 10px 0;
                color: #495057;
                font-size: 14px;
            }}
            .line-change {{
                margin-bottom: 15px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 5px;
                border-left: 3px solid #6c757d;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📋 Invoice Approval Required</h1>
            <p>Your action is needed for the following invoice</p>
        </div>
        
        <div class="content">
            <div class="invoice-details">
                <h2>Invoice Details</h2>
                <div class="detail-row">
                    <span class="detail-label">Invoice Number:</span>
                    <span class="detail-value">{invoice_number}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Invoice Amount:</span>
                    <span class="detail-value">₹{formatted_amount}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Audit ID:</span>
                    <span class="detail-value">{audit_id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Submission Date:</span>
                    <span class="detail-value">{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Approver:</span>
                    <span class="detail-value">{approver_name}</span>
                </div>
            </div>

            {changes_html}


            <!-- 🔥 NEW: Check Invoice Section -->
<div class="view-invoice-section">
    <h3>🔍 Review Invoice Document</h3>
    <p>View the original invoice PDF/image with all details</p>
    <a href="{invoice_view_url}" target="_blank" class="btn btn-view">
        📄 View Invoice Document
    </a>
    <p style="margin-top: 10px; font-size: 12px; color: #666;">
        <em>Opens invoice document directly - no need to search</em>
    </p>
</div>
                
                <a href="{approve_url}" class="btn btn-approve">✅ Approve</a>
                <a href="{reject_url}" class="btn btn-reject">❌ Reject</a>
                <a href="{request_edit_url}" class="btn btn-edit">✏️ Request Edit</a>
            </div>

            <div class="footer">
                <p>This is an automated message from the Invoice Approval System.</p>
                <p>If you believe you received this email in error, please contact the system administrator.</p>
                <p><small>Audit ID: {audit_id} | Invoice: {invoice_number}</small></p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html_content

# 🔥 NEW: Function to generate changes summary HTML
def generate_changes_summary_html(changes):
    """
    Generate HTML for the changes summary section
    """
    changes_html = '<div class="changes-section">\n'
    changes_html += '<h3>📊 CHANGES SUMMARY</h3>\n'
    
    # Header changes
    if changes.get("header_changes"):
        changes_html += '<div class="changes-group">\n'
        changes_html += '<h4>📋 Header Changes</h4>\n'
        changes_html += '<table class="changes-table">\n'
        
        for field, change_desc in changes["header_changes"].items():
            # Format field name for display
            field_display = field.replace('_', ' ').title()
            changes_html += f'''
            <tr>
                <td class="change-field">{field_display}</td>
                <td class="change-arrow">→</td>
                <td class="change-new">{change_desc}</td>
            </tr>
            '''
        
        changes_html += '</table>\n'
        changes_html += '</div>\n'
    
    # Line changes
    if changes.get("line_changes"):
        changes_html += '<div class="changes-group">\n'
        changes_html += '<h4>📝 Line Item Changes</h4>\n'
        
        for line_num, line_changes in changes["line_changes"].items():
            changes_html += f'<div class="line-change">\n'
            changes_html += f'<strong>Line {line_num}:</strong>\n'
            changes_html += '<table class="changes-table">\n'
            
            for field, change_desc in line_changes.items():
                field_display = field.replace('_', ' ').title()
                changes_html += f'''
                <tr>
                    <td class="change-field">{field_display}</td>
                    <td class="change-arrow">→</td>
                    <td class="change-new">{change_desc}</td>
                </tr>
                '''
            
            changes_html += '</table>\n'
            changes_html += '</div>\n'
        
        changes_html += '</div>\n'
    
    changes_html += '</div>\n'
    return changes_html

# 🔥 NEW: Function to generate plain text email with change diffs
def generate_approval_email_plain_text(invoice_number, formatted_amount, audit_id, approver_name, 
                                     changes, approve_url, reject_url, request_edit_url):
    """
    Generate plain text email content with change diffs
    """
    
    # 🔥 ENHANCED: Generate changes summary for plain text
    changes_text = ""
    if changes and (changes.get("header_changes") or changes.get("line_changes")):
        changes_text = generate_changes_summary_plain_text(changes)
    
    plain_text = f"""
INVOICE APPROVAL REQUEST

Dear {approver_name},

An invoice requires your approval:

Invoice Number: {invoice_number}
Invoice Amount: ₹{formatted_amount}
Audit ID: {audit_id}
Submission Date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

{changes_text if changes_text else "No specific changes mentioned."}

Please take action using one of these links:

✅ APPROVE: {approve_url}
❌ REJECT: {reject_url}
✏️ REQUEST EDIT: {request_edit_url}

Thank you,
Invoice Approval System
"""
    return plain_text

# 🔥 NEW: Function to generate plain text changes summary
def generate_changes_summary_plain_text(changes):
    """
    Generate plain text for the changes summary section
    """
    changes_text = "CHANGES SUMMARY:\n\n"
    
    # Header changes
    if changes.get("header_changes"):
        changes_text += "Header Changes:\n"
        changes_text += "-" * 40 + "\n"
        
        for field, change_desc in changes["header_changes"].items():
            field_display = field.replace('_', ' ').title()
            changes_text += f"  {field_display}: {change_desc}\n"
        
        changes_text += "\n"
    
    # Line changes
    if changes.get("line_changes"):
        changes_text += "Line Item Changes:\n"
        changes_text += "-" * 40 + "\n"
        
        for line_num, line_changes in changes["line_changes"].items():
            changes_text += f"Line {line_num}:\n"
            
            for field, change_desc in line_changes.items():
                field_display = field.replace('_', ' ').title()
                changes_text += f"  {field_display}: {change_desc}\n"
            
            changes_text += "\n"
    
    return changes_text

def send_action_notification_email(invoice_number, action, notes, recipient_email):
    """
    Send notification email back to the requester with HTML formatting
    """
    try:
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', 587))
        sender_email = os.getenv('SMTP_USER', '')
        sender_password = os.getenv('SMTP_PASSWORD', '')
        
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        
        action_display = {
            'approve': {'text': '✅ APPROVED', 'color': '#28a745'},
            'reject': {'text': '❌ REJECTED', 'color': '#dc3545'}, 
            'request_edit': {'text': '✏️ EDIT REQUESTED', 'color': '#ffc107'}
        }
        
        action_info = action_display.get(action, {'text': action.upper(), 'color': '#6c757d'})
        
        msg['Subject'] = f'Update: Invoice #{invoice_number} - {action_info["text"]}'
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: {action_info['color']};
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                }}
                .content {{
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 10px;
                    margin-top: 20px;
                }}
                .status-badge {{
                    display: inline-block;
                    background: {action_info['color']};
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                    margin: 10px 0;
                }}
                .notes-section {{
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    border-left: 4px solid {action_info['color']};
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Invoice Status Update</h1>
                <p>Your invoice has been processed</p>
            </div>
            
            <div class="content">
                <h2>Invoice #{invoice_number}</h2>
                <div class="status-badge">{action_info['text']}</div>
                
                <div class="notes-section">
                    <h3>📝 Notes from Approver:</h3>
                    <p>{notes if notes else 'No additional notes provided.'}</p>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>If approved: Invoice will proceed to payment processing</li>
                    <li>If rejected: Please review and resubmit with corrections</li>
                    <li>If edit requested: Please make the requested changes and resubmit</li>
                </ul>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                    <p>This is an automated notification from the Invoice Approval System.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_content, 'html'))
        
        # Plain text fallback
        plain_text = f"""
        Your invoice has been processed:
        
        Invoice Number: {invoice_number}
        Status: {action_info['text']}
        
        Notes from approver:
        {notes if notes else 'No additional notes provided.'}
        
        Thank you,
        Invoice Approval System
        """
        msg.attach(MIMEText(plain_text, 'plain'))
        
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        logger.info(f"📧 HTML notification email sent to {recipient_email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to send notification email: {e}")
        return False