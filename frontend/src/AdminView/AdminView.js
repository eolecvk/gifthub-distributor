import React, { Component } from "react";
import AdminViewSlider from "./AdminViewSlider"
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios'

// Example: https://blog.stvmlbrn.com/2019/02/20/automatically-refreshing-data-in-react.html
class AdminView extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const { cookies } = props;
    this.state = cookies.get("roomInfo") || "";
  }

  intervalID;

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  getData = () => {
    axios
      .get('/api/' + this.state.room_code)
      .then(response => {
        this.setState({ people: response.data.people });
        // call getData() again in 5 seconds
        this.intervalID = setTimeout(this.getData.bind(this), 5000);
      });
  }

  render() {
    const people = this.state.people
    const totalAmountDollars = this.state.splitting_cents / 100
    const roomCode = this.state.room_code
    const roomName = this.state.room_name

    const maxVoteCents = Math.max(...people.map(p => p.votes_cents).flat())
    const maxNeedUpperBoundCents = Math.max(...people.map(p => p.needs_upper_bound_cents).flat())
    const max = Math.max(...[maxVoteCents, maxNeedUpperBoundCents]) / 100

    return (
      <div>
        <h1>Admin View Page</h1>
        <h2>{roomName}</h2>
        <h2>Room Code: {roomCode}</h2>
        <h2>Total Amount: ${totalAmountDollars}</h2>
        {people.map(p =>
          <AdminViewSlider
            sliderId={p.person_id.toString()}
            name={p.name}
            needsUpperBound={p.needs_upper_bound_cents / 100}
            needsLowerBound={p.needs_lower_bound_cents / 100}
            totalAmountDollars={totalAmountDollars}
            max={max}
            votes={p.votes_cents.map(v => v / 100)}
            avg={p.avg_cents / 100}
          />)}
      </div>
    );
  }
}

export default withCookies(AdminView);
