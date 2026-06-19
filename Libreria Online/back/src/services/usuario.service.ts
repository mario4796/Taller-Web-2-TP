import { UsuarioRepository } from '../repository/usuario.repository.js';

export class UsuariosService {
  private usuarioRepository: UsuarioRepository;

  constructor(usuarioRepository: UsuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  public async obtenerProveedores() {
   
    return await this.usuarioRepository.obtenerProveedores();
  }
}