import { useEffect, useState } from "react";

function NotFound() {
    const [backgroundImage, setBackgroundImage] = useState<string>('');
    const [sourceImage, setSourceImage] = useState<string>('');


    useEffect(() => {
        fetch("https://43d.github.io/404/photos.json", {
            method: 'GET',
            redirect: 'follow'
        })
            .then(async response => randonly(await response.text()))
    }, []);

    const randonly = (text: string) => {
        const data = JSON.parse(text);
        const count = Object.keys(data.photos).length;
        const r = Math.floor(Math.random() * (count));
        const res = Object.values(data.photos)[r] as string[];
        const src = "http://pixiv.net/artworks/" + res[0];
        const image = "https://43d.github.io/404/image/" + res[0] + "_p" + res[1] + ".jpg";
        setSourceImage(src);
        setBackgroundImage("url(" + image + ")");
    }

    return (
        <div id="display-image" style={{ backgroundImage: backgroundImage }}>
            <div id="alert-404" className="position-absolute top-50 start-50 translate-middle px-5 py-1">
                <p className="text-center m-1">404</p>
                <p className="text-center m-0">Are you well?</p>
                <p className="text-center m-1">souce link: <a href={sourceImage} target="_blank" rel="noopener noreferrer">here</a></p>
            </div>
        </div>
    );
}

export default NotFound