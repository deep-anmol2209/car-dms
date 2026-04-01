import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendRestockAlert(data: any) {
  const templatePath = path.join(
    process.cwd(),
    "lib/templates/emails/restock-alert.ejs"
  )

  const html = await ejs.renderFile(templatePath, data) as string

  await transporter.sendMail({
    from: `"Car DMS AI" <${process.env.EMAIL_USER}>`,
    to: "admin@gmail.com",
    subject: `🚨 ${data.priority} Restock Alert: ${data.model}`,
    html,
  })
}