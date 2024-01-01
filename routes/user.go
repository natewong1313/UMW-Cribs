package routes

import (
	"context"
	"strings"
	"time"

	"firebase.google.com/go/auth"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/natewong1313/web-app-template/server/database"
)

func (r *router) setupUserRoutes(routeGroup fiber.Router) {
	routeGroup.Get("/", r.getUser)
	routeGroup.Get("/verify", r.verifyToken)
	routeGroup.Get("/likes", r.getUserLikes)
	routeGroup.Post("/likes", r.updateUserLike)
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

func getUserFromReq(fbClient *auth.Client, c *fiber.Ctx) (*auth.UserRecord, error) {
	idToken := parseIDToken(c)
	decoded, err := fbClient.VerifySessionCookieAndCheckRevoked(context.Background(), idToken)
	if err != nil {
		return nil, err
	}
	user, err := fbClient.GetUser(context.Background(), decoded.UID)
	if err != nil {
		return nil, err
	}
	return user, nil
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

	user, err := getUserFromReq(r.cfg.FirebaseClient, c)
	if err != nil {
		return c.Status(401).JSON(userResponse{
			Error: err.Error(),
		})
	}

	return c.JSON(userResponse{
		User: user,
	})
}

type getUserLikesResponse struct {
	Likes []database.Like `json:"likes"`
	Error string          `json:"error"`
} //@name GetUserLikesResponse

// GetUserLikes
// @Summary		Get user likes
// @Description	get user likes
// @ID				get-user-likes
// @Produce		json
// @Success		200		{object}	getUserLikesResponse
// @Router			/api/user/likes [get]
func (r *router) getUserLikes(c *fiber.Ctx) error {
	user, err := getUserFromReq(r.cfg.FirebaseClient, c)
	if err != nil {
		return c.Status(401).JSON(getUserLikesResponse{
			Error: err.Error(),
		})
	}

	var likes []database.Like
	if err := r.cfg.DB.Where("user_id = ?", user.UID).Find(&likes).Error; err != nil {
		return c.Status(400).JSON(getUserLikesResponse{
			Error: err.Error(),
		})
	}

	return c.JSON(getUserLikesResponse{
		Likes: likes,
	})
}

type updateUserLikeBody struct {
	ListingID string `json:"listingId"`
	Action    string `json:"action"`
} //@name UpdateUserLikeBody

type updateUserLikeResponse struct {
	Error string `json:"error"`
} //@name UpdateUserLikeResponse

// UpdateUserLike
// @Summary		Update user like
// @Description	update user like
// @ID				update-user-like
// @Produce		json
// @Success		200		{object}	updateUserLikeResponse
// @Router			/api/user/likes [post]
func (r *router) updateUserLike(c *fiber.Ctx) error {
	user, err := getUserFromReq(r.cfg.FirebaseClient, c)
	if err != nil {
		return c.Status(401).JSON(updateUserLikeResponse{
			Error: err.Error(),
		})
	}

	var body updateUserLikeBody
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(updateUserLikeResponse{
			Error: err.Error(),
		})
	}
	if body.Action == "like" {
		r.cfg.DB.Where("user_id = ? AND listing_id = ?", user.UID, body.ListingID).FirstOrCreate(&database.Like{
			UserID:    user.UID,
			ListingID: body.ListingID,
			CreatedAt: time.Now(),
		})
	} else if body.Action == "unlike" {
		r.cfg.DB.Where("user_id = ? AND listing_id = ?", user.UID, body.ListingID).Delete(&database.Like{})
	}
	return c.JSON(updateUserLikeResponse{})

	// var like database.Like
	// if err := c.BodyParser(&like); err != nil {
	// 	return c.Status(400).JSON(updateUserLikeResponse{
	// 		Error: err.Error(),
	// 	})
	// }
	// like.UserID = user.UID
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
