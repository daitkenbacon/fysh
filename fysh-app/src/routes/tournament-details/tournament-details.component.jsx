import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

import { getDocInCollection } from "../../utils/firebase/firebase.utils";

const TournamentDetails = () => {
    const { id } = useParams();
    const [tournament, setTournament] = useState([]);

    useEffect(() => {
        async function getTournament() {
            const t = await getDocInCollection('tournaments', id);
            setTournament(t.data());
            
        }
        getTournament();
    }, [])

    return(
        <div>
            <h1>{tournament.name && tournament.name}</h1>
        </div>
    )
}

export default TournamentDetails;