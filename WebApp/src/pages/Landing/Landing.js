import useHttp from "../../hooks/use-http";
import "./Landing.scss";
import { useEffect, useState } from "react";

const Landing = () => {
    const [usd, setUsd] = useState(54)
    const [eu, setEU] = useState(60)
    const http = useHttp();

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

    return (
        <div className="srhero__sidebar">
            <ul>
                <li className='srhero__divisas'>
                    <h3>Divisas:</h3>
                    <ul>
                        <li><span>US:</span> {usd} DOP</li>
                        <li><span>EU:</span> {eu} DOP</li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}

export default Landing;