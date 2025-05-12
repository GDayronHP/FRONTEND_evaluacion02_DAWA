import { useState } from "react";

import Switch from "../components/Switch";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function AuthView() {
  const [loginActive, setLoginActive] = useState(true);

  return (
    <main className="flex w-full h-full justify-center items-center bg-[#23384B] text-white">
      <section className="lg:w-1/3 bg-contain w-0 h-full">
        <img
          className="h-full bg-cover bg-center "
          src="https://media.istockphoto.com/id/154232673/photo/blue-ridge-parkway-scenic-landscape-appalachian-mountains-ridges-sunset-layers.jpg?s=612x612&w=0&k=20&c=m2LZsnuJl6Un7oW4pHBH7s6Yr9-yB6pLkZ-8_vTj2M0="
          alt="Imagen"
        />
      </section>
      <section aria-labelledby="register-title" className="lg:w-2/3 w-full grid place-content-center p-24">
        <header className="mb-4">
          <h1 id="register-title" className="text-3xl font-bold font-sans mb-2">
            Bienvenido de vuelta!
          </h1>
          <p className="font-extralight text-lg tracking-wide ">
            ¡Hola!, por favor rellena los siguientes campos para comenzar.
          </p>
        </header>

        <Switch loginActive={loginActive} setLoginActive={setLoginActive} />

        {loginActive ? <LoginForm /> : <RegisterForm />}
      </section>
    </main>
  );
}

export default AuthView;
