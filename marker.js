export function Marker(gender = null, number = null, person = null) {
  this.gender = gender; // (f/m/n)
  this.number = number; // (p/s)
  this.person = person; // (1/2/3)
  
  this.merge = function(marker) {
    let gender = this.gender;
    let number = this.number;
    let person = this.person;
    
    if (marker.gender === "f") {
      if (gender === "m" || gender === "n") {
        return null;
      } else {
        gender = marker.gender;
      }
    } else if (marker.gender === "m") {
      if (gender === "f") {
        return null;
      } else {
        gender = marker.gender;
      }
    } else if (marker.gender === "n") {
      if (gender === "f") {
        return null;
      } else if (gender !== "m") {
        gender = marker.gender;
      }
    }
    
    if (marker.number !== null) {
      if (number !== null && number !== marker.number) {
        return null;
      }
      
      number = marker.number;
    }
    
    if (marker.person !== null) {
      if (person !== null && person !== marker.person) {
        return null;
      }
      
      person = marker.person;
    }
    
    return new Marker(gender, number, person);
  };
};
