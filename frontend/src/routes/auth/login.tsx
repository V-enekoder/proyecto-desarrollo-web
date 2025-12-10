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
import { login } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/login";

const loginSchema = z.object({
  username: z
    .string({ error: "El nombre de usuario es requerido" })
    .nonempty({ error: "El nombre de usuario es requerido" }),
  password: z
    .string({ error: "La contraseña es requerida" })
    .nonempty({ error: "La contraseña es requerida" }),
});

export const meta: Route.MetaFunction = () => [
  { title: "Login - Sistema de Reservas de Laboratorio - UNEG" },
];

// export async function clientAction({ request }: Route.ClientActionArgs) {
//   const formData = await request.formData();
//   const submission = parseWithZod(formData, { schema: loginSchema });

//   if (submission.status !== "success") {
//     return submission.reply();
//   }

//   return await login(submission.value).then(
//     () => {
//       throw redirect("/");
//     },
//     async (error) => {
//       return submission.reply({
//         formErrors: await extractErrorMessages(error),
//       });
//     },
//   );
// }

export default function LoginRoute() {
  const formId = useId();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit, setError, register, formState } = form;
  const { isSubmitting, errors } = formState;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values);
      navigate("/");
    } catch (error) {
      const errors = await extractErrorMessages(error);
      setError("root", { message: errors[0] });
    }
  };

  return (
    <AuthTemplate
      title="Iniciar Sesión"
      subtitle="Ingresa tus credenciales para continuar."
      content={
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${formId}-username`}>
                Nombre de Usuario
              </FieldLabel>
              <Input
                placeholder="Ingresa tu nombre de usuario"
                autoComplete="username"
                type="text"
                id={`${formId}-username`}
                {...register("username")}
              />
              <FieldError>{errors.username?.message}</FieldError>
            </Field>

            <Field>
              <div className="flex justify-between gap-4">
                <FieldLabel htmlFor={`${formId}-password`}>
                  Contraseña
                </FieldLabel>

                <Button
                  type="button"
                  variant="link"
                  className="max-md:hidden"
                  asChild
                >
                  <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                </Button>
              </div>
              <PasswordInput
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                id={`${formId}-password`}
                {...register("password")}
              />
              <FieldError>{errors.password?.message}</FieldError>
            </Field>

            <Field>
              <FieldError>{errors.root?.message}</FieldError>
            </Field>

            <Field>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="uppercase"
              >
                {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
              </Button>
            </Field>

            <Field className="md:hidden">
              <Button type="button" variant="link" asChild>
                <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
              </Button>
            </Field>

            <p className="text-muted-foreground text-center text-sm">
              ¿Aún no tienes cuenta?{" "}
              <Button asChild variant="link" size="sm">
                <Link to="/register">Regístrate aquí</Link>
              </Button>
            </p>
          </FieldGroup>
        </form>
      }
      asideContent={
        <>
          <div className="flex flex-col gap-3">
            <div className="hidden text-4xl font-medium md:block">
              ¡Hola, Amigo!
            </div>
            <div className="text-sm leading-snug">
              Ingresa tus datos personales y comienza tu viaje con nosotros hoy
              mismo.
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="bg-transparent uppercase"
          >
            <Link to="/register">Registrarse</Link>
          </Button>
        </>
      }
    />
  );
}
