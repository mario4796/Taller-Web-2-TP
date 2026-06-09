import env from "env-var";

export const config = {

    PORT: env.get('PORT').required().asPortNumber()

}   