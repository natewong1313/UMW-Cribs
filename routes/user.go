package routes

import (
	"strings"
	"time"

	"firebase.google.com/go/auth"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

func (r *router) setupUserRoutes(routeGroup fiber.Router) {
	routeGroup.Get("/", r.getUser)
	routeGroup.Get("/verify", r.verifyToken)
}

func createNewSessionCookie(fbClient *auth.Client, c *fiber.Ctx, idToken string) error {
	expiresIn := time.Hour * 24 * 5
	cookie, err := fbClient.SessionCookie(c.Context(), idToken, expiresIn)
	if err != nil {
		return err
	}
	c.Cookie(&fiber.Cookie{
		Name:     "session",
		Value:    cookie,
		Expires:  time.Now().Add(expiresIn),
		HTTPOnly: true,
		Secure:   true,
	})
	return nil
}

func parseIDToken(c *fiber.Ctx) string {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Cookies("session")
	}
	return strings.ReplaceAll(authHeader, "Bearer ", "")
}

type userResponse struct {
	User  *auth.UserRecord `json:"user"`
	Error string           `json:"error"`
} //@name UserResponse

// GetUser
// @Summary		Get user
// @Description	get user
// @ID				get-user
// @Produce		json
// @Success		200		{object}	userResponse
// @Router			/api/user [get]
func (r *router) getUser(c *fiber.Ctx) error {
	idToken := parseIDToken(c)

	decoded, err := r.cfg.FirebaseClient.VerifySessionCookieAndCheckRevoked(c.Context(), idToken)
	if err != nil {
		return c.Status(401).JSON(userResponse{
			Error: err.Error(),
		})
	}

	user, err := r.cfg.FirebaseClient.GetUser(c.Context(), decoded.UID)
	if err != nil {
		return c.Status(401).JSON(userResponse{
			Error: err.Error(),
		})
	}

	return c.JSON(userResponse{
		User: user,
	})
}

type verifyTokenResponse struct {
	Verified bool   `json:"verified"`
	Error    string `json:"error"`
} //@name VerifyTokenResponse

// VerifyToken
//
//	@Summary		verify auth token from firebase
//	@Description	verify auth token from firebase
//	@ID				verify-token
//	@Produce		json
//	@Success		200		{object}	verifyTokenResponse
//	@Router			/api/user/verify [get]
func (r *router) verifyToken(c *fiber.Ctx) error {
	idToken := parseIDToken(c)

	err := createNewSessionCookie(r.cfg.FirebaseClient, c, idToken)
	if err != nil {
		log.Errorf("error creating session cookie: %v\n", err)
		return c.Status(401).JSON(verifyTokenResponse{
			Verified: false,
			Error:    err.Error(),
		})
	}
	return c.JSON(verifyTokenResponse{
		Verified: true,
	})
}
