export default function Loader({show, center = false}) {
  return show ? 
    (center ? <div className="flexCenter"><div className="loader"></div></div> : <div className="loader"></div>) : null;
}