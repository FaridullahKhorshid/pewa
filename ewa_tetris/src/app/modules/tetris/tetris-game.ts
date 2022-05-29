export class TetrisGame {

    /* Returns the color of a block, based on its value and the level */
    public getColor(num: number, level: number): string
    {
        if(level < 10) {
            switch (num) {
                case 1:
                    return '#845ec2';
                
                case 2:
                    return '#2c73d2';

                case 3:
                    return '#0081cf';

                case 4:
                    return '#0089ba';
                
                case 5:
                    return '#008e9b';

                case 6:
                    return '#008f7a';

                default:
                    return '#00c9a7'
            }
        }

        else if (level < 20) {
            switch (num) {
                case 1:
                    return '#38bee3';
                
                case 2:
                    return '#41a7e3';

                case 3:
                    return '#658ed8';

                case 4:
                    return '#8771bf';
                
                case 5:
                    return '#9e5299';

                case 6:
                    return '#a4326a';

                default:
                    return '#0088ac'
            }
        }

        else if (level < 30) {
            switch (num) {
                case 1:
                    return '#ebb144';
                
                case 2:
                    return '#b3ab35';

                case 3:
                    return '#7ba039';

                case 4:
                    return '#3f9346';
                
                case 5:
                    return '#008255';

                case 6:
                    return '#007061';

                default:
                    return '#005248'
            }
        }

        else if (level < 40) {
            switch (num) {
                case 1:
                    return '#110b98';
                
                case 2:
                    return '#004cce';
                
                case 3:
                    return '#0078e9';
                
                case 4:
                    return '#009fea';

                case 5:
                    return '#00c4d8';

                case 6:
                    return '#00e6bf';

                default:
                    return '#66baa8';
            }
        }

        else {
            switch (num) {
                case 1:
                    return '#110b98';
                
                case 2:
                    return '#a50083';
                
                case 3:
                    return '#e70064';
                
                case 4:
                    return '#ff6c48';

                case 5:
                    return '#ffb543';

                case 6:
                    return '#f9f871';

                default:
                    return '#da276f';
            }
        }
    }
}