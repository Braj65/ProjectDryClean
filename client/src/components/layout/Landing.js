import React, { Component } from "react";
import Tux from "../hoc/Tux";
// import classes from "./Landing.css";
import Background from '../../assets/images/laundry-1459934_640.jpg';
var sectionStyle = {
// width: "50%",
// height: "400px",
backgroundImage: "url(" + Background + ")",
backgroundPosition: 'center',
backgroundSize: 'cover',
backgroundRepeat: 'no-repeat',
};
class Landing extends Component {


  render() {
    return (
      <Tux>
      <main style={sectionStyle}>
        <h2> Sunlight drycleaners </h2>
        <h3> Bhandrak branch </h3>
        <article>
            <section>
               <p> quotes: </p>
               <p> When in doubt, wear from Sunlight </p>
               <p> Mind what you wear, it's the only place where you live </p>
            </section>

            <section>
               <h3> Orders to deliver <strong>today</strong> </h3>
               <h3> A table here </h3>
            </section>

            <section>
               <h3> Orders to deliver <strong>tomorrow</strong> </h3>
               <h3> A table here </h3>
            </section>

        </article>

        <article>

            <section>
               <h3> <strong>holiday list</strong> </h3>
               <h3> A table here </h3>
            </section>


        </article>
      </main>
      </Tux>
    );
  }
}

export default Landing;
