//צוללת
function submarine(length, i, j, direction)
{
    this.length=length;
    this.i=i;
    this.j=j;
    this.direction=direction;
    this.isDiscovered=false;
}
//מיקום
function location1(i, j)
{
    this.i=i;
    this.j=j;
}