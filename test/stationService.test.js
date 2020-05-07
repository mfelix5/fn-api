const { expect } = require('chai')
const sinon = require("sinon");
const { ObjectID } = require("mongodb");
const Station = require("../src/models/station")
const stationService = require("../src/services/stationService");

describe("Station Service", () => {
  let findOneStub, findOneAndUpdateStub, findStub;

  beforeEach(async () => {
    findOneStub = sinon.stub(Station, "findOne");
    findStub = sinon.stub(Station, "find");
    findOneAndUpdateStub = sinon.stub(Station, "findOneAndUpdate");
  });

  afterEach(async () => {
    sinon.restore();
  });

  it("findStationByName should query database correctly", async () => {
    const stationName = "testing123"
    await stationService.findStationByName(stationName);
    expect(findOneStub.args[0][0].name).to.equal(stationName);
  });

  it("findStationsOnLine should query database correctly", async () => {
    const line = "test line";
    const system = "test system";
    await stationService.findStationsOnLine(line, system);
    const args = findStub.args[0][0];
    expect(args).to.be.an("object");
    expect(args.lines).to.eql({ $in: line });
    expect(args.system).to.equal(system);
  });

  it("findLinesInSystem should query database correctly", async () =>{
    findStub.returns([]);
    const systemName = "the train system";
    await stationService.findLinesInSystem(systemName);
    const args = findStub.args[0][0];
    expect(args.system).to.equal(systemName);
  });

  it("updateStation should return error if no id provided", async () => {
    const updateToStation = { name: "new name"}
    const err = await stationService.updateStation("", updateToStation);
    expect(err).to.include("_id").and.to.include("required");
  });

  it("updateStation should call database correctly", async () => {
    findOneAndUpdateStub.returns({});
    const id = new ObjectID();
    const updateToStation = { name: "new name"}
    await stationService.updateStation(id, updateToStation);
    const args = findOneAndUpdateStub.args[0];
    expect(args[0]).to.eql({ _id: id });
    expect(args[1]).to.eql(updateToStation);
  });
});