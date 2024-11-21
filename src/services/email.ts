import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_j0wlzsr';
const EMAILJS_TEMPLATE_ID = 'template_tldb9fm';
const EMAILJS_PUBLIC_KEY = 'lUMecRWAlUyxdDjec';

interface EmailData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const sendEmail = async (data: EmailData): Promise<void> => {
  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      from_phone: data.phone,
      message: data.message,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};