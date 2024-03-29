import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  setCheckInDate,
  setCheckOutDate,
  submitBooking,
} from "../../store/bookings"; // Import booking actions
import { singleSpotThunk, clearSpotsAction } from "../../store/spots";
import { loadReviewThunk } from "../../store/reviews";
import { fetchBookingsForSpot } from "../../store/bookings"; // Add the new import
import "./SpotShow.css";
import OpenModalButton from "../OpenModalButton/index";
import CreateReviewModal from "../CreateReview";
import DeleteReviewModal from "../DeleteReview";
import Calendar from "../Booking/calendar";

const SpotShow = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.singleSpot);
  let reviews = useSelector((state) => state.reviews.reviews);
  reviews = Object.values(reviews);
  let user = useSelector((state) => state.session.user);

  const booking = useSelector((state) => state.bookings);
  const { checkInDate, checkOutDate, loading, error } = booking;

  const firstReview = (user, reviews, spot) => {
    if (user === null || user === undefined) return false; //=> Need to log in to post a review
    if (Boolean(reviews.length)) return false; // => checks if reviews already exit
    if (user.id === spot.ownerId) return false; //=>// => You can't write a review for your own spot
    return true;
  };

  const postReviewButton = (user, reviews, spot) => {
    if (user === null || user === undefined) return false; //=> Need to log in to post a review
    for (let review of reviews) {
      if (review.userId === user.id)
        // =>Can't post a second review
        return false;
    }
    if (user.id === spot.ownerId) return false; // => You can't write a review for your own spot
    return true;
  };

  const deleteReviewButton = (user, review) => {
    if (user === null || user === undefined) return false;
    if (user.id === review.userId) return true;
    return false;
  };

  const reviewNum = (num) => {
    if (num === 1) return "1 review";
    else return ` ${num} reviews`;
  };

  const reviewMonthYear = (moment) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let created = new Date(moment);
    let result = `${months[created.getMonth()]} ${created.getFullYear()}`;
    return result;
  };


  useEffect(() => {
    dispatch(singleSpotThunk(spotId));
    dispatch(loadReviewThunk(spotId));
    dispatch(fetchBookingsForSpot(spotId)); // Fetch booked dates for the spot
    return () => dispatch(clearSpotsAction());
  }, [dispatch, spotId]);

  const startDate = useSelector((state) => state.bookings.checkInDate);
  const endDate = useSelector((state) => state.bookings.checkOutDate);
  const bookedDates = useSelector((state) => state.bookings.bookedDates);

  const comingImg =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4ETJqrc4M9dIqhXg2iNzuFyQVxLvDwPyueVGKoSBQEdZcm_rhTEwWGWmP09wI7lcjCEw&usqp=CAU";
  if (!spot) return null;

  if (!spot.SpotImages) return null;
  if (!spot.Owner) return <h1>Owner not Found...</h1>;
  if (!reviews) return null;

  return (
    <>
      <div className="fullPageShow">
        <div>
          <h1>{spot.name}</h1>
          <p>
            {spot.city}, {spot.state}, {spot.country}
          </p>
          <div className="showContainer">
            <div>
              <img
                src={spot.SpotImages[0].url}
                alt="firstImg"
                className="imgShowLeft"
              />
            </div>
            <div className="rightContainerShow">
              <div className="smallImg">
                <img
                  src={spot.SpotImages[1]?.url || comingImg}
                  alt="spotsImgs"
                  className="imgShowRight"
                />
                <img
                  src={spot.SpotImages[2]?.url || comingImg}
                  alt="spotsImgs"
                  className="imgShowRight"
                />
              </div>
              <div className="smallImg">
                <img
                  src={spot.SpotImages[3]?.url || comingImg}
                  alt="spotsImgs"
                  className="imgShowRight"
                />
                <img
                  src={spot.SpotImages[4]?.url || comingImg}
                  alt="spotsImgs"
                  className="imgShowRight"
                ></img>
              </div>
            </div>
          </div>

          <div className="spotDetails">
            <div className="hostedText">
              <h2>
                {" "}
                Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
              </h2>
              <p>{spot.description}</p>
            </div>
            <div className="reserveContainer">
              <div className="priceInfo">
                <div className="night">
                  <p className="priceP">${spot.price}</p>
                  <p>night</p>
                </div>

                {spot.avgStarRating === "NaN" ? (
                  <div className="new">
                    <i class="fa-sharp fa-solid fa-star"></i>
                    <h4> New </h4>
                  </div>
                ) : (
                  <div className="number2">
                    <i class="fa-sharp fa-solid fa-star"></i>
                    <h4>{spot.avgStarRating}</h4>
                    <h4 className="dot">.</h4>
                    <h4 className="pushLeft">{reviewNum(spot.numReviews)}</h4>
                  </div>
                )}
              </div>
              <div >
              <Calendar
  selectedStartDate={startDate}
  selectedEndDate={endDate}
  onDatesChange={({ startDate, endDate }) => {
    dispatch(setCheckInDate(startDate));
    dispatch(setCheckOutDate(endDate));
  }}
  spotId={spotId}
  bookedDates={bookedDates} 
/>
              </div>
            </div>
          </div>

          <div className=".secondContainer">
            {firstReview(user, reviews, spot) ? (
              <div>
                <div className="number">
                  <i class="fa-sharp fa-solid fa-star"></i>
                  <h2>New</h2>
                </div>
                <p className="oneRem">Be the first to post a review!</p>
              </div>
            ) : (
              <div>
                <div className="starAndNum">
                  <i class="fa-sharp fa-solid fa-star"></i>
                  {spot.avgStarRating === "NaN" ? (
                    <h2>New</h2>
                  ) : (
                    <div className="number">
                      <h4 className="number">{spot.avgStarRating}</h4>
                      <h4 className="dot">.</h4>
                      <h4 className="pushLeft">{reviewNum(spot.numReviews)}</h4>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="push">
              {postReviewButton(user, reviews, spot) ? (
                <OpenModalButton
                  buttonText="Post your review"
                  modalComponent={<CreateReviewModal spot={spot} />}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <div className="allReviews">
            {reviews
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((review) => (
                <div className="singleReview">
                  <h4 className="reviewer">{review.User.firstName}</h4>
                  <p className="reviewTime">
                    {reviewMonthYear(review.createdAt)}
                  </p>
                  <p className="reviewContent">{review.review}</p>
                  <div>
                    {deleteReviewButton(user, review) ? (
                      <OpenModalButton
                        buttonText="Delete"
                        modalComponent={
                          <DeleteReviewModal review={review} spotId={spotId} />
                        }
                      />
                    ) : null}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SpotShow;
