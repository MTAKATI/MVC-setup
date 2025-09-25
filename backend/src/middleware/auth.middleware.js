{/** Checks if the user has been authenticated: before they get to update the profile */}
export const protectedRoute = async (req, res, next) => {   //request, response, nextMethod
    {/** !req.auth() is not undefined because we are calling the clermiddleware: handles authentication */}
    if (!req.auth().isAuthenticated){ 
        res.status(401).json({message: "Unauthorized - you  must be logged-in"});           //status code: 401 -> User unauthorised
    }
    next();     //else if user is authenticated: just call the next method
};