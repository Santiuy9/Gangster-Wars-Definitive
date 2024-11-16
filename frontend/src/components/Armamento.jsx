import React from "react";
import ItemCard from "./ItemCard";
import Bate from '../assets/Bate-de-Madera.jpg';
import Cuchillo from '../assets/Cuchillo-de-Combate.jpg'
import Pistola from '../assets/semi-automatic-handgun-on-a-solid-color-background-close-up-ai-generative-free-photo.jpg'

export default function Armamento( {userInfo} ) {
    return (
        <div className="category-content">
            <h2>Armamento</h2>
            <ItemCard 
                userInfo={userInfo}
                title="Bate de Baseball"
                imageSrc={Bate}
                description="Bate de Madera robusto"
                price="750"
                category="Armamento"
                proBarName="Daño"
                proBarTxtColor="black"
                proBarBgColor="red"
                proBarPercentage="10"
            />
            <ItemCard 
                userInfo={userInfo}
                title="Cuchillo de Combate"
                imageSrc={Cuchillo}
                description="Cuchillo militar de combate tactico"
                price="1390"
                category="Armamento"
                proBarName="Daño"
                proBarTxtColor="black"
                proBarBgColor="red"
                proBarPercentage="15"
            />
            <ItemCard 
                userInfo={userInfo}
                title="Pistola"
                imageSrc={Pistola}
                description="Una pistola de 9mm"
                price="2590"
                category="Armamento"
                proBarName="Daño"
                proBarTxtColor="black"
                proBarBgColor="red"
                proBarPercentage="20"
            />
        </div>
    )
}