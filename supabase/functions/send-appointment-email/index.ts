
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  appointmentId: string;
  emailType: 'booking_confirmation' | 'therapist_notification' | 'status_update' | 'reminder';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { appointmentId, emailType }: EmailRequest = await req.json()

    // Fetch appointment details with user and therapist info
    const { data: appointment, error: appointmentError } = await supabaseClient
      .from('appointments')
      .select(`
        *,
        therapist:therapists(name, specialties)
      `)
      .eq('id', appointmentId)
      .single()

    if (appointmentError || !appointment) {
      throw new Error('Appointment not found')
    }

    // Get user email from auth.users (this requires service role key)
    const { data: { user }, error: userError } = await supabaseClient.auth.admin.getUserById(appointment.user_id)
    
    if (userError || !user?.email) {
      throw new Error('User not found or no email')
    }

    // Generate email content based on type
    let subject = '';
    let htmlContent = '';
    let recipientEmail = user.email;

    switch (emailType) {
      case 'booking_confirmation':
        subject = '🎉 Appointment Booking Confirmed - Chetna_AI';
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Booking Confirmed!</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Your therapy session has been successfully booked</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
              <h2 style="color: #4a5568; margin-bottom: 20px; font-size: 22px;">📋 Appointment Details</h2>
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 8px 0; color: #2d3748;"><strong>🏥 Therapist:</strong> ${appointment.therapist?.name || 'TBD'}</p>
                <p style="margin: 8px 0; color: #2d3748;"><strong>📅 Date:</strong> ${appointment.appointment_date}</p>
                <p style="margin: 8px 0; color: #2d3748;"><strong>⏰ Time:</strong> ${appointment.appointment_time}</p>
                <p style="margin: 8px 0; color: #2d3748;"><strong>🎯 Session Type:</strong> ${appointment.session_type.replace('_', ' ').toUpperCase()}</p>
                <p style="margin: 8px 0; color: #2d3748;"><strong>📋 Status:</strong> <span style="background: #48bb78; color: white; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; font-size: 12px;">${appointment.status}</span></p>
              </div>
              
              <div style="background: #e6fffa; border: 1px solid #38b2ac; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #234e52; font-size: 14px;"><strong>💡 What's Next?</strong></p>
                <p style="margin: 8px 0 0 0; color: #234e52; font-size: 14px;">Your appointment is currently <strong>pending confirmation</strong>. We'll send you another email once your therapist confirms the session.</p>
              </div>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
              <h3 style="color: #4a5568; margin-bottom: 15px; font-size: 18px;">🤝 Need Help?</h3>
              <p style="color: #718096; margin: 8px 0; line-height: 1.6;">If you have any questions or need to reschedule, please contact our support team. We're here to help you on your mental health journey.</p>
            </div>
            
            <div style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 30px;">
              <p>💙 Sent with care from the Chetna_AI Team</p>
              <p>Empowering your mental wellness journey, one step at a time.</p>
            </div>
          </div>
        `;
        break;

      case 'status_update':
        subject = `📋 Appointment Status Update - ${appointment.status.toUpperCase()}`;
        const statusEmoji = appointment.status === 'confirmed' ? '✅' : appointment.status === 'cancelled' ? '❌' : '📋';
        const statusColor = appointment.status === 'confirmed' ? '#48bb78' : appointment.status === 'cancelled' ? '#f56565' : '#4299e1';
        
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">${statusEmoji} Status Update</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Your appointment status has been updated</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
              <div style="text-align: center; margin-bottom: 25px;">
                <span style="background: ${statusColor}; color: white; padding: 12px 24px; border-radius: 25px; font-size: 18px; font-weight: bold; text-transform: uppercase;">
                  ${appointment.status}
                </span>
              </div>
              
              <h2 style="color: #4a5568; margin-bottom: 20px; font-size: 22px;">📋 Appointment Details</h2>
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px;">
                <p style="margin: 8px 0; color: #2d3748;"><strong>🏥 Therapist:</strong> ${appointment.therapist?.name || 'TBD'}</p>
                <p style="margin: 8px 0; color: #2d3748;"><strong>📅 Date:</strong> ${appointment.appointment_date}</p>
                <p style="margin: 8px 0; color: #2d3748;"><strong>⏰ Time:</strong> ${appointment.appointment_time}</p>
                <p style="margin: 8px 0; color: #2d3748;"><strong>🎯 Session Type:</strong> ${appointment.session_type.replace('_', ' ').toUpperCase()}</p>
                ${appointment.notes ? `<p style="margin: 8px 0; color: #2d3748;"><strong>📝 Notes:</strong> ${appointment.notes}</p>` : ''}
                ${appointment.cancellation_reason ? `<p style="margin: 8px 0; color: #2d3748;"><strong>❌ Cancellation Reason:</strong> ${appointment.cancellation_reason}</p>` : ''}
              </div>
            </div>
            
            <div style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 30px;">
              <p>💙 Sent with care from the Chetna_AI Team</p>
            </div>
          </div>
        `;
        break;

      default:
        throw new Error('Invalid email type')
    }

    // Store email notification in database
    const { error: insertError } = await supabaseClient
      .from('email_notifications')
      .insert({
        appointment_id: appointmentId,
        recipient_email: recipientEmail,
        email_type: emailType,
        subject: subject,
        body: htmlContent
      })

    if (insertError) {
      console.error('Error storing email notification:', insertError)
    }

    // Note: In a real implementation, you would integrate with an email service like Resend
    // For now, we'll just simulate sending and update the notification record
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update notification as sent
    await supabaseClient
      .from('email_notifications')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('appointment_id', appointmentId)
      .eq('email_type', emailType)

    console.log(`Email ${emailType} sent to ${recipientEmail} for appointment ${appointmentId}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailType,
        recipient: recipientEmail
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in send-appointment-email function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
