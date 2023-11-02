export class Room {
  public id: string = ''
  public ownerId: string = ''

  async create(ownerId: string): Promise<Room> {
    return fetch('http://localhost:8080/room/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ownerId})
    }).then(response => response.json())
  }

  async validate(roomId: string): Promise<Room> {
    return fetch(`http://localhost:8080/room/${roomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(response => response.json())
  }
}