import useHttp from "../../hooks/use-http";
import "./Landing.scss";
import { useEffect, useState } from "react";
import Card from "../../components/core/Card/Card";
import Button from "../../components/core/Button/Button";
import Image1 from "../../assets/images/Landing/1.jpg";
import Image2 from "../../assets/images/Landing/2.jpg";
import Image3 from "../../assets/images/Landing/3.jpg";
import Image4 from "../../assets/images/Landing/4.jpg";
import Image5 from "../../assets/images/Landing/5.jpg";
import { useHistory } from 'react-router-dom';


const Landing = () => {
    const history = useHistory()
    const [usd, setUsd] = useState(54)
    const [eu, setEU] = useState(60)
    const http = useHttp();

    const plans = [
        {
            key: 1,
            title: "Basic",
            advantages: ['500 users', 'Help with implementation'],
            image: Image3,
            price: 2000
        },
        {
            key: 1,
            title: "Full",
            advantages: ['Unlimeted users', 'Help with implementation', '24 hours support'],
            image: Image4,
            price: 3000
        },
        {
            key: 1,
            title: "Premium",
            advantages: ['Unlimeted users', 'Help with implementation', 'Meeting app', 'Calendar app', '24 hours support'],
            image: Image5,
            price: 5000
        }
    ]

    const cardClickHandler = () => {
        history.push('/login')
    }

    const fetchData = async () => {
        const responseUSD = await http.sendRequest({url: '/rate/usd/dop'});
        const responseEU = await http.sendRequest({url: '/rate/eu/dop'});

        if(responseUSD.ok) {
            const data = await responseUSD.json();
            setUsd(data.rate)
        }
        if(responseEU.ok) {
            const data = await responseEU.json();
            setEU(data.rate)
        }
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [])

    const goToLogin = () => {
        history.push('/login')
    }

    return (
        <div className="srhero__sidebar">
            <Button onClick={goToLogin}>Login</Button>
            <ul>
                <li className='srhero__divisas'>
                    <Card>
                        <h1>Student Risk Hero: Necesidad</h1>
                        <div className="content">
                            <img src={Image1} width={"300px"} alt="page" />
                            <p>
                                Existe una gran debilidad en el sistema educativo que está afectando a miles de jóvenes y es el hecho de no poder medir correctamente su rendimiento académico afectando hasta al punto de perder una beca y corriendo el riesgo de que el estudiante se desanime y no continúe sus estudios, con el propósito de mejorar los sistemas educativos actuales, Se desarrolla la herramienta que permite ver el rendimiento académico acumulado y de periodo, donde también se pueda ofrecer ayuda por tutoría, ayuda psicológica y económica a aquellos que se encuentren en riesgo y que cumplan con el proceso de evaluación y orientación académica.
                            </p>
                        </div>
                        <div className="content">                            
                            <p>
                            El proyecto completo consta de 2 etapas,
                                una funge como base de datos que guarde
                                la información de las calificaciones, perfiles,
                                aptitudes de los estudiantes y los comparta
                                con las universidades, por otro lado, el
                                sistema que ayude a los estudiantes que
                                se encuentren en bajo rendimiento y/o con
                                riesgo de dejar la escuela.
                            </p>
                            <img src={Image2} width={"300px"} alt="page" />
                        </div>
                        <div className="row">
                        <h1>Planes:</h1>
                        {plans.map(i => (
                            <div className="col-xs-12 col-sm-4" key={i.key}>
                                <Card>
                                    <div className="information" onClick={() => cardClickHandler(i.key)}>
                                        <div className="line">
                                            <h2>{i.title}</h2>
                                        </div>
                                        <div style={{display: "flex", justifyContent: 'center'}}>
                                            <img  width={"300px"} src={i.image} alt={i.title} />
                                        </div>
                                        <div>
                                            <ul>
                                                {i.advantages.map(a => (
                                                    <li key={a.key}>{a}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3>{i.price} DOP</h3>
                                            <h3>{(i.price / eu).toFixed(2)} EU</h3>
                                            <h3>{(i.price / usd).toFixed(2)} USD</h3>
                                            <Button>Conocer mas</Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                    </Card>  
                </li>
            </ul>
        </div>
    );
}

export default Landing;