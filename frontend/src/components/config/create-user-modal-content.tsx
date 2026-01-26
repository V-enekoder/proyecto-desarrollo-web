import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { registerFormSchema } from "@/components/auth/register-form/schema";
import { usersService } from "@/services/users";
import { setErrorFromServer } from "@/lib/api";

type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface Props {
  onCreated?: (id: string) => void;
  onClose?: () => void;
}

export function CreateUserModalContent({ onCreated, onClose }: Props) {
  const formId = useId();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const { confirmPassword: _, ...data } = values;
    const payload = { ...data, email: data.email ?? null };

    try {
      const user = await usersService.create(payload);
      onCreated?.(user.id);
      onClose?.();
    } catch (error: any) {
      setErrorFromServer(setError, error);
    }
  };

  return (
    <div>
      <div className="p-4">
        <form
          noValidate
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${formId}-username`}>
                Nombre de Usuario
              </FieldLabel>
              <Input
                id={`${formId}-username`}
                placeholder="Ingresa un nombre de usuario"
                {...register("username")}
              />
              <FieldError>{errors.username?.message}</FieldError>
            </Field>

            <div className="flex flex-col gap-4 *:flex-1 md:flex-row">
              <Field>
                <FieldLabel htmlFor={`${formId}-name`}>Nombre</FieldLabel>
                <Input
                  id={`${formId}-name`}
                  placeholder="Nombre completo"
                  {...register("name")}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor={`${formId}-email`}>Email</FieldLabel>
                <Input
                  id={`${formId}-email`}
                  placeholder="correo@ejemplo.com"
                  {...register("email")}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor={`${formId}-password`}>Contraseña</FieldLabel>
              <PasswordInput
                id={`${formId}-password`}
                {...register("password")}
              />
              <FieldError>{errors.password?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor={`${formId}-confirm-password`}>
                Confirmar contraseña
              </FieldLabel>
              <PasswordInput
                id={`${formId}-confirm-password`}
                {...register("confirmPassword")}
              />
              <FieldError>{errors.confirmPassword?.message}</FieldError>
            </Field>

            <Field>
              <FieldError>{errors.root?.message}</FieldError>
            </Field>

            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
