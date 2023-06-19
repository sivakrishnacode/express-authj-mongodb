import AuthJ from "authj";

const authj = AuthJ()

export function isAuth(req, res, next){
    authj.checkToken({token: req.headers.token })
    .then((res) => {
        req.user = res
        next()
    }).catch((err) => {
        return res.status(401).json({ error: err });
    })
  }