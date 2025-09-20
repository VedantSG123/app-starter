# **Next.js 15 \+ Elysia.js \+ Better-Auth Starter**

This is a starter template designed to kickstart your next full-stack project with a modern, decoupled architecture. It features a **Next.js 15** frontend and a high-performance **Elysia.js** backend, with a complete authentication system powered by **Better-Auth**. Both are powered by the **Bun** runtime.
The primary goal of this repository is to provide a clear, production-ready example of how to integrate better-auth when using Next.js purely as a frontend client with a dedicated backend API.

## **The Problem This Solves**

While better-auth has excellent documentation for full-stack Next.js applications (where Next.js handles both frontend and backend), there's a lack of guidance for a decoupled setup. This starter kit bridges that gap, providing a clear and scalable pattern for connecting a Next.js frontend to a separate backend API for authentication.

## **Tech Stack**

- **Runtime:** [Bun](https://bun.sh/)
- **Frontend:** [Next.js](https://nextjs.org/) 15
- **Backend:** [Elysia.js](https://elysiajs.com/)
- **Authentication:** [Better-Auth](https://www.better-auth.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **DB Client:** [node-pg](https://node-postgres.com/) (with a singleton Pool instance for efficient connection management)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## **Features**

This starter comes with a robust authentication system already built for you:

- ✅ User Signup with email verification
- ✅ User Login (Session-based using secure, HTTP-only cookies)
- ✅ Password Reset flow (Forgot Password)
- ✅ Protected Routes on both Frontend and Backend
- ✅ Centralized API client in Next.js for easy fetching
- ✅ Clear separation of concerns between frontend and backend

### **Prerequisites**

- [Bun](https://bun.sh/docs/installation)
- A running [PostgreSQL](https://www.postgresql.org/download/) instance

> [!IMPORTANT]
> I am using [Resend](https://resend.com/) for emails, feel free to use the mainling library you wish to use
