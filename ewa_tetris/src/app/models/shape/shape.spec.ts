import {Shape} from './shape';

describe('Shape', () => {
  it('should create an instance', () => {
    expect(new Shape([])).toBeTruthy();
  });

  it('should create an random shape', () => {
    let shape = Shape.getRandomShape();
    expect(shape).toBeTruthy();
  });


  it('should change the coordinates of the shape', () => {
    let shape = Shape.getRandomShape();
    let coordinates = shape.getCoordinates();

    // drop shape down
    shape.drop();

    expect(JSON.stringify(coordinates)).toEqual(JSON.stringify(shape.getCoordinates()));
  });
});
