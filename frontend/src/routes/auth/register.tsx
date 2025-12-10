import RegisterForm from "@/components/auth/register-form";

export default function RegisterRoute() {
  return (
    <>
      <title>Crear cuenta - Sistema de Reservas de Laboratorio - UNEG</title>
      <RegisterForm
        title="Crear cuenta"
        subtitle="Crea tu cuenta para continuar."
        asideTitle="¡Bienvenido de Nuevo!"
        asideSubtitle="Si ya tienes una cuenta, inicia sesión para acceder a tu cuenta."
        loginButton={true}
        admin={false}
      />
    </>
  );
}
