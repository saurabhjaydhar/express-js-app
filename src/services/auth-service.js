

export const jwtSign = (userId, email) => {
  return jwt.sign(
    { user_id: userId, email },
    'SXqrqphaiLc92_sibuxhsEPvtjQlUx_WwMxdjZ7qp-odX3kAUbZi-H4ZvazieO2D',
    {
      expiresIn: '2h',
    },
  );
};

const jwtVerify = (token) => {
  return jwt.verify(
    token,
    'SXqrqphaiLc92_sibuxhsEPvtjQlUx_WwMxdjZ7qp-odX3kAUbZi-H4ZvazieO2D',
  );
};


const extractToken = (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  };
  
  
  const verifyToken = (req, res, next) => {
    const token = extractToken(req);
    // console.log(token);
  
    if (token) {
      try {
        const decodeToken = jwtVerify(token);
      
  
        const email = decodeToken.email;
        const id = decodeToken.user_id;
        req.email = email;
        req.userId = id;
        next();
      } catch (error) {
        res.status(400).json({ message: 'Authorization error' });
      }
    } else {
      res.status(400).json({ message: 'Authorization error' });
    }
  };
  
  export  const comparePassword = async (plaintextPassword, hash) => {
    return await bcrypt
      .compare(plaintextPassword, hash)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        // console.log(err);
      });
  };


  





  export default {
    jwtSign,
    jwtVerify,
    extractToken,
    verifyToken,
    comparePassword,
  };