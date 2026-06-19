
import type { EmpleadoRepository } from "../repository/empleado.repository.js"

export class EmpleadoService {


    constructor(private empleadoRepository: EmpleadoRepository) { }

    async obtenerEmpleados() {
        return await this.empleadoRepository.findAllEmpleados();
    }



}