export type Show = {
  title: string
  time: string
  type: 'estreno' | 'reprise' | 'retro' | 'maraton' | 'pelicula'
  description?: string
}

export const schedule: Record<string, Show[]> = {
  'Lunes': [
    { title: 'Naruto', time: '16:00 - 17:00', type: 'estreno' },
    { title: 'One Piece', time: '17:00 - 18:00', type: 'reprise' },
  ],
  'Martes': [
    { title: 'Bleach', time: '16:00 - 17:00', type: 'estreno' },
    { title: 'Dragon Ball', time: '17:00 - 18:00', type: 'reprise' },
  ],
  'Miércoles': [
    { title: 'Attack on Titan', time: '16:00 - 17:00', type: 'estreno' },
    { title: 'Sailor Moon', time: '17:00 - 18:00', type: 'reprise' },
  ],
  'Jueves': [
    { title: 'My Hero Academia', time: '16:00 - 17:00', type: 'estreno' },
    { title: 'Pokémon', time: '17:00 - 18:00', type: 'reprise' },
  ],
  'Viernes': [
    { title: 'Fullmetal Alchemist', time: '16:00 - 17:00', type: 'estreno' },
    { title: 'Digimon', time: '17:00 - 18:00', type: 'reprise' },
  ],
  'Sábado': [
    { title: 'Anime Retro', time: '08:00 - 12:00', type: 'retro' },
    { title: 'Maratón: Naruto', time: '12:00 - 18:00', type: 'maraton' },
    { title: 'One Piece', time: '18:00 - 19:00', type: 'estreno' },
    { title: 'Dragon Ball', time: '19:00 - 20:00', type: 'reprise' },
  ],
  'Domingo': [
    { title: 'Anime Retro', time: '08:00 - 12:00', type: 'retro' },
    { title: 'Película: Your Name', time: '12:00 - 14:00', type: 'pelicula' },
    { title: 'Attack on Titan', time: '14:00 - 15:00', type: 'estreno' },
    { title: 'Sailor Moon', time: '15:00 - 16:00', type: 'reprise' },
  ],
}