// Home.jsx
import React  from 'react';
import { useContext } from "react";
import { UserContext } from "../UserContext";
import Button from './Button'

import './css/home.css';


export default function Home() {
    const { userInfo } = useContext(UserContext);
    return (
        <main className='PrincipalContainer'>
            {userInfo ? (
                <div className='Home'>
                    <h1>¡Bienvenido de vuelta, {userInfo.username}</h1>
                    <p>Nos preguntamos... Que crimenes realizaremos hoy jefe?</p>
                    <Button label="Misiones" to="/misiones" />
                    <Button label="Negocios" to="/negocios" />
                    <Button label="Tienda" to="/tienda" />
                    {/* <Button label="Pandilla" to="/pandilla" /> */}
                    <Button label="Personaje" to="/personaje"/>
                    {/* <Button label="Equipo" to="/equipo" /> */}
                    {/* Aquí puedes agregar más contenido del juego */}
                </div>
            ) : (
                <div>
                    <div>
                        <h1>Bienvenido a Gangster Wars</h1>
                        <p>Explora el juego y disfruta de la experiencia.</p>

                    </div>
                </div>
            )}
        </main>
    );
}




// import React, { useState, useEffect } from 'react';
// import Button from './Button';
// import './css/Home.css'

// export default function Home({ username }) {
//     // const handleButtonClick = () => {
//     //     alert('Boton Clickeado')
//     // }

//     // console.log("Username en Home:", username);

//     // useEffect(() => {
//     //     console.log("Username en Home:", username);
//     // }, [username]);

//     return (
//         <div className='PrincipalContainer'>
//             {username ? (
//                 <div className='Home'>
//                     <h1>Bienvenido {username}</h1>
//                     <p>Nos preguntamos... Que crimenes realizaremos hoy jefe?</p>
//                     <Button label="Misiones" to="/misiones" />
//                     <Button label="Negocios" to="/negocios" />
//                     <Button label="Tienda" to="/tienda" />
//                     {/* <Button label="Pandilla" to="/pandilla" /> */}
//                     <Button label="Personaje" to="/personaje"/>
//                     {/* <Button label="Equipo" to="/equipo" /> */}

//                 </div>
//             ) : (
//                 <div>
//                     <h1>Bienvenido a Gangster Wars</h1>
//                     <p>Explora el juego y disfruta de la experiencia.</p>

//                 </div>
//             )}
//         </div>
//     );
// };