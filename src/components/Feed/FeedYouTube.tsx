function FeedYouTube() {

    return (
        <div className="d-flex align-items-center h-100 pt-5">
            <iframe className="yt-frame rounded" src="https://www.youtube.com/embed/videoseries?si=9c4JWNcyGkhFeLWj&amp;list=PL6M6kcpHOAb_1zF5Z6WXpnOr0NHw52dNB" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            {/* <iframe className="yt-frame rounded" src="https://www.youtube.com/embed/mmrXiqmXdus?si=BT31CGGfwbC_A5Gu" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe> */}
        </div>
    )
}

export default FeedYouTube