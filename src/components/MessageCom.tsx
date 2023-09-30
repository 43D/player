interface MessageProps{
    msg: string;
}

function MessageCom({msg}: MessageProps){
    return (
        <div>
            <p>{msg}</p>
        </div>
    );
}

export default MessageCom