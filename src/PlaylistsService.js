const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistByIdWithSong(playlistId) {
    try {
      const query = {
        text: `
        SELECT 
          p.id, p.name,
          array_to_json(array_agg(json_build_object(
          'id', s.id,
          'title', s.title,
          'performer', s.performer
          ))) AS songs
        FROM 
          playlists p
        LEFT JOIN 
          playlist_songs ps ON ps.playlist_id = p.id
        LEFT JOIN 
          songs s ON s.id = ps.song_id
        WHERE 
          p.id = $1
        GROUP BY 
          p.id`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = PlaylistsService;
