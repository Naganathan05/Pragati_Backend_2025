import * as chaiModule from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";
import { expect } from "chai";

const server = "http://localhost:5000";
const chai = chaiModule.use(chaiHttp);

import { signupTestCases } from "./testCases/signup.js";

describe("POST - /api/auth/signup", () => {
    signupTestCases.forEach(
        ({ name, payload, expectedStatus, expectedMessage, expectedData }) => {
            it(name, async () => {
                const res = await chai.request
                    .execute(server)
                    .post("/api/auth/signup")
                    .send(payload);
                expect(res).to.have.status(expectedStatus);
                expect(res.body).to.have.property("MESSAGE", expectedMessage);
                expect(res.body).to.have.haveOwnProperty("DATA");
            });
        },
    );
});
