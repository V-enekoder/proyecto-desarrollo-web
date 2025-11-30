import { AuthTemplate } from "@/components/auth/auth-template";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { extractErrorMessages } from "@/lib/api";
import { registerAdministrator } from "@/lib/auth";
import { getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { Form, redirect, useNavigation } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/register";

const registerSchema = z
  .object({
    username: z
      .string({ error: "El nombre de usuario es requerido" })
      .nonempty({ error: "El nombre de usuario es requerido" }),
    name: z
      .string({ error: "El nombre es requerido" })
      .nonempty({ error: "El nombre es requerido" }),
    email: z.email({ error: "Correo electrónico inválido" }),
    password: z
      .string({ error: "La contraseña es requerida" })
      .min(6, { error: "La contraseña debe tener al menos 6 caracteres" }),
    confirmPassword: z.string({ error: "Confirma la contraseña" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export const meta: Route.MetaFunction = () => [
  {
    title:
      "Crear cuenta administrador - Sistema de Reservas de Laboratorio - UNEG",
  },
];

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: registerSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await registerAdministrator(submission.value);
    alert("Administrador creado exitosamente.");
  } catch (error) {
    const errors = await extractErrorMessages(error);
    return submission.reply({
      formErrors: errors,
    });
  }
}

export default function RegisterRouteAdministrador({
  actionData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [form, fields] = useForm({
    lastResult: actionData,
    onValidate(context) {
      return parseWithZod(context.formData, { schema: registerSchema });
    },
  });

  return (
    <AuthTemplate
      title="Crear Administrador"
      subtitle="Crea administradores de manera rapida."
      content={
        <Form
          noValidate
          method="post"
          id={form.id}
          onSubmit={form.onSubmit}
          className="md:min-w-lg"
        >
          <FieldGroup className="md:gap-3">
            <Field>
              <FieldLabel htmlFor={fields.username.id}>
                Nombre de Usuario
              </FieldLabel>
              <Input
                placeholder="Ingresa tu nombre de usuario"
                autoComplete="username"
                {...getInputProps(fields.username, { type: "text" })}
              />
              <FieldError id={fields.username.errorId}>
                {fields.username.errors}
              </FieldError>
            </Field>
            <div className="flex flex-col gap-4 *:flex-1 md:flex-row">
              <Field>
                <FieldLabel htmlFor={fields.name.id}>Nombre</FieldLabel>
                <Input
                  placeholder="Ingresa tu nombre"
                  autoComplete="name"
                  {...getInputProps(fields.name, { type: "text" })}
                />
                <FieldError id={fields.name.errorId}>
                  {fields.name.errors}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor={fields.email.id}>Email</FieldLabel>
                <Input
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  {...getInputProps(fields.email, { type: "email" })}
                />
                <FieldError id={fields.email.errorId}>
                  {fields.email.errors}
                </FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor={fields.password.id}>Contraseña</FieldLabel>
              <PasswordInput
                placeholder="Ingresa tu contraseña"
                autoComplete="new-password"
                {...getInputProps(fields.password, { type: "password" })}
              />
              <FieldError id={fields.password.errorId}>
                {fields.password.errors}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor={fields.confirmPassword.id}>
                Confirmar contraseña
              </FieldLabel>
              <PasswordInput
                {...getInputProps(fields.confirmPassword, { type: "password" })}
                placeholder="Confirma tu contraseña"
                autoComplete="new-password"
              />
              <FieldError id={fields.confirmPassword.errorId}>
                {fields.confirmPassword.errors}
              </FieldError>
            </Field>
            <Field>
              <FieldError>{form.errors}</FieldError>
            </Field>

            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando administrador..." : "Crear cuenta"}
              </Button>
            </Field>
          </FieldGroup>
        </Form>
      }
      asideContent={
        <>
          <div className="flex flex-col justify-center gap-3">
            <div className="hidden text-2xl font-medium md:block">
              ¡Bienvenido Administrador!
            </div>
            <div className="text-sm leading-snug">
              Crea administradores para gestionar el sistema de reservas de
              forma rapida y segura
            </div>
          </div>
        </>
      }
    />
  );
}
