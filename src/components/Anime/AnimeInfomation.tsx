import AnimeInfo from '../../type/AnimeInfo';

interface AnimeProps {
    anime: AnimeInfo;
}

function AnimeInfomation({ anime }: AnimeProps) {

    return (
        <div className='row'>
            <div className='col-12 col-md-4 col-xl-3 d-flex mb-3'>
                <img className='cover-anime mx-auto ' src={`${anime.data[0].images.jpg.large_image_url}`} alt="cover" />
            </div>
            <div className='col'>

                <ul className="list-group">

                    <li className='list-group-item p-0'>
                        <table className="table table-anime table-hover mb-0">
                            <tbody>
                                <tr>
                                    <td colSpan={5}>{anime.data[0].title} - ({anime.data[0].type})</td>
                                </tr>
                                <tr>
                                    <th>Episodies: </th>
                                    <td colSpan={2}>{anime.data[0].episodes}</td>
                                    <th>Duration: </th>
                                    <td>{anime.data[0].duration}</td>
                                </tr>
                                <tr>
                                    <th>Score: </th>
                                    <td colSpan={2}>{anime.data[0].score}</td>
                                    <th>Reviewer users: </th>
                                    <td>{anime.data[0].scored_by}</td>
                                </tr>
                                <tr>
                                    <th>Status:</th>
                                    <td colSpan={2}>{anime.data[0].status}</td>
                                    <th>MyAnimeList:</th>
                                    <td><a href={`${anime.data[0].url}`} target='_blank'>ID: {anime.data[0].mal_id}</a></td>
                                </tr>
                                <tr>
                                    <th>Studios</th>
                                    <td colSpan={4}>
                                        {anime.data[0].studios.map((item) => (
                                            <span key={item.name}><a href={`${item.url}`} target='_blank'>{item.name} ({item.type})</a> </span>
                                        ))}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Synopsis</th>
                                    <td colSpan={4}>{anime.data[0].synopsis}</td>
                                </tr>
                            </tbody>
                        </table>
                    </li>

                </ul>
            </div>
        </div>
    );
}

export default AnimeInfomation