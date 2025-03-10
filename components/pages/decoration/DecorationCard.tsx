import Birthday from "./Birthday";
import Custom from "./Custom";
import Festival from "./Festival";
import Pre_wedding from "./Pre-wedding";
import Wedding from "./Wedding";

const DecorationCard = () => {
    return (
        <div className="grid grid-cols-3 gap-5">
        <Custom/>
        <Birthday/>
        <Festival/>
        <Pre_wedding/>
        <Wedding/>
        <Wedding/>
        </div>
    );
};

export default DecorationCard;