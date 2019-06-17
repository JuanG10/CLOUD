import { app } from './App';
import { UNQfy } from '../modelo/unqfy';
import bodyParser from 'body-parser';
import { DuplicatedError } from '../modelo/Errores/DuplicatedError';

const PORT = 3030;
const unqfy = new UNQfy();

app.use(bodyParser());

/*
============================= RUTAS ARTISTA ============================================
 */

app.post('/artists', (req, res) => {
  const nameOfArtist: string = req.body.name;
  const countryOfArtist: string = req.body.country;

  try {
    unqfy.addArtist({ name: nameOfArtist, country: countryOfArtist });
    res.status(201);
    res.send({
      id: unqfy.findArtistByName(nameOfArtist).getId(),
      name: nameOfArtist,
      country: countryOfArtist,
      albums: [],
    });

  } catch (error) {
    res.status(409);
    res.send({
      status: 409,
      errorCode: 'RESOURCE_ALREADY_EXISTS',
    });
  }
});

app.get('/artists/:id', (req, res) => {

  try {
    const artist =  unqfy.getArtistById(req.params.id);
    res.send({
      id: artist.getId(),
      name: artist.getName(),
      country: artist.getCountry(),
      albums: artist.getAlbums(),
    });

  } catch (error) {
    res.status(404);
    res.send('artist not found');

  }
});

app.patch('artists/:id', (req, res) => {
  try {
    const newName = req.body.name;
    const newCountry = req.body.country;
    const artist = unqfy.getArtistById(req.params.id);
    artist.country = newCountry;
    artist.name = newName;

    res.send({
      id: artist.getId(),
      name: artist.getName(),
      country: artist.getCountry(),
      albums: artist.getAlbums(),

    });
  } catch (error) {
    res.status(409);
    res.send();
  }
});

app.delete('/artists/:id', (req, res) => {
  try {
    unqfy.deleteArtist(req.params.id);
    res.status(204);
  }catch (e) {
    res.status(404);
    res.send({

      status: 404,
      errorCode: 'RESOURCE_NOT_FOUND',
    });
  }
});

app.get('/artists', (req, res) => {
  const artistName = req.query.name;
  let artists;
  if (!artistName) {
    artists = unqfy.getArtists();
  } else {
    artists = unqfy.findArtistsByName(artistName);
  }
  res.status(200);
  res.send(artists);
});

/*
============================= RUTAS ALBUM ============================================
 */

app.post('/albums', (req, res) => {
  try {
    const artistID = req.body.artistId;
    const albumName = req.body.name;
    const albumRealeaseDate = req.body.year;
    const artistName = unqfy.getArtistById(artistID).getName();

    unqfy.addAlbum(artistName, { name: albumName, year: albumRealeaseDate });
    res.status(201);
    res.send({
      artistId: artistID,
      name: albumName,
      year: albumRealeaseDate,
    });
  }catch (error) {
    res.status(404);
    res.send({
      status: 404,
      errorCode: 'RELATED_RESOURCE_NOT_FOUND',
    });
  }
});

app.get('/albums/:id', (req, res) => {

  try {
    const album = unqfy.getAlbumById(req.params.id);
    res.status(200);
    res.send({
      id: album.getId(),
      name: album.getName(),
      year: album.getYear(),
      tracks: album.getTracks(),
    });
  }catch (error) {
    res.status(404);
    res.send({
      status: 404, errorCode: 'RESOURCE_NOT_FOUND',
    });
  }
});

app.put('/albums/:id', (req, res) => {
  try {
    const album = unqfy.getAlbumById(req.params.id);
    album.year = req.body.year;

    res.status(200);
    res.send({
      id: album.getId(),
      name: album.getName(),
      year: album.getYear(),
      tracks: album.getTracks(),

    });
  }catch (error) {
    res.status(404);
    res.send({
      status:404,
      errorCode: 'RELATED_RESOURCE_NOT_FOUND',
    });
  }
});

app.delete('/albums/:id', (req, res) => {
  try {
    unqfy.deleteAlbum(req.params.id);
    res.status(204);
  }catch (error) {
    res.status(404);
    res.send({
      status: 404,
      errorCode: 'RESOURCE_NOT_FOUND',
    });

  }

});

app.get('/albums', (req, res) => {
  const albumName = req.query.name;
  let albums;
  if (!albumName) {
    albums = unqfy.getAlbums();
  } else {
    albums = unqfy.findArtistsByName(albumName);
  }
  res.status(200);
  res.send(albums);
});

/*
============================= RUTAS TRACK ============================================
*/

app.get('/tracks/:id/lyrics', async (req, res) => {
  const trackId = req.params.id;
  const track = unqfy.getTrackById(trackId);
  const lyrics = await track.getLyrics();
  res.status(200);
  res.send(lyrics);
});

/*
======================================================================================
*/

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));