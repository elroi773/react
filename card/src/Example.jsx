import { Card } from "./Card";
import image from "./img/Untilifoundyou.jpg";


export const Example = () => {
    const handleProfile = () => {

    };

    const handleFollow = () =>{

    };

    return (
        <section>
            <Card image={image} title = "Jess Willson" subtitle = "UX Enginner" description = "Empowering users through ..." onProfile={handleProfile} onFollow={handleFollow} />
        </section>
    );
};