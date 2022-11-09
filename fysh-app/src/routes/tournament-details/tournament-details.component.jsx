import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

import { getDocInCollection } from "../../utils/firebase/firebase.utils";

const TournamentDetails = () => {
    const { id } = useParams();
    console.log("The id is: ", id);
    const [tournament, setTournament] = useState([]);

    useEffect(() => {
        async function getTournament() {
            const t = await getDocInCollection('tournaments', id);
            setTournament(t.data());
            
        }
        getTournament();
    }, [])

    console.log(tournament);

    return(
        <h1>{tournament && tournament.name}</h1>
    )
}

export default TournamentDetails;