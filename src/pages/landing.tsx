import { CurrentPage } from "../userInterfaceTypes"

type LandingProps = {
    setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>
}

export function Landing ({setCurrentPage}: LandingProps) {

    return (
        <div>
            <div className="font-bold text-xl my-2 w-40 m-auto text-center">
                Perfect Team Viewer
            </div>
            <div className="flex mx-40">
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setCurrentPage(CurrentPage.LANDING)}>Stats Importer</button></div>
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setCurrentPage(CurrentPage.LANDING)}>Tournament Stats</button></div>
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setCurrentPage(CurrentPage.LANDING)}>Season Stats</button></div>
                <div className="text-center flex-1 mr-4"><button className="w-full mx-8 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setCurrentPage(CurrentPage.CARD_IMPORTER)}>Card Importer</button></div>
            </div>
        </div>
    )
}