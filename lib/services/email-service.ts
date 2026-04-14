import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
})
export async function sendRestockAlert(data: any[]) {
  const templatePath = path.join(
    process.cwd(),
    "lib/template/restock-alert.ejs"
  )

  const html = await ejs.renderFile(templatePath, { items: data }) as string

  await transporter.sendMail({
    from: `"Car DMS AI" <${process.env.SMTP_USER}>`,
    to: "officialavtar13@gmail.com",
    subject: `🚨 Inventory Restock Alert (${data.length} items)`,
    html,
  })
}