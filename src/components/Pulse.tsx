import { CreateAnimation, Animation, IonIcon } from '@ionic/react';
import { heart } from 'ionicons/icons';


function Pulse() {
    return (
        <CreateAnimation
            duration={1000}
            iterations={Infinity}
            fromTo={[
                { property: 'transform', fromValue: 'scale(1)', toValue: 'scale(1.2)' },
            ]}
            easing="ease-in-out"
            play={true}
        >
            <IonIcon style={{ float: "right" }} icon={heart} color="danger"></IonIcon>
        </CreateAnimation>
    );
}

export default Pulse;