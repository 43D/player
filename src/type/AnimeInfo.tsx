type image = {
    image_url: string,
    small_image_url: string,
    large_image_url: string
}

type images = {
    jpg: image,
    webp: image
}

type titles = {
    type: string,
    title: string
}

type aired = {
    string: string,
    from: string
}

type studio = {
    type: string,
    name: string,
    url: string
}

type data = {
    mal_id: number,
    url: string,
    images: images,
    titles: titles[],
    title: string,
    title_english: string,
    title_synonyms: string[],
    type: string,
    episodes: number,
    status: string,
    airing: false,
    aired: aired,
    duration: string,
    score: number,
    scored_by: number,
    synopsis: string,
    studios: studio[],
    season: string,
    year: number
}

type AnimeInfo = {
    data: data[]
}
export default AnimeInfo
