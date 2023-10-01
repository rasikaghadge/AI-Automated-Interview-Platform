import CompanyData from "../models/CompanyModel.js";
import jwt from "jsonwebtoken";

export const addCompany = (req, res) => {
  const { HRname, companyName, logo, email, password, location } = req.body;
  const generatedToken = jwt.sign(
    {
      email: "kalpeshpawar@gmail.com",
      permissions: ["Admin"],
    },
    process.env.SECRET
  );
  console.log(generatedToken);
  const company = new CompanyData({
    HRname,
    companyName,
    logo,
    email,
    password,
    location,
    token: generatedToken,
  });
  company
    .save()
    .then((result) => {
      console.log(result);

      res.send(result);
    })
    .catch((e) => {
      console.log(e.message);
    });
};


export const loginCompany = (req, res) => {
  const { email, password } = req.body;
  console.log(req.company);
  res.send("The current logged in company is: " + req.company.email);
}
