import { Col, Card, CardBody, CardTitle } from 'reactstrap';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
const HomeGroups = ({ isError, isLoading, userStore, data }) => {
  if (isLoading) {
    return (
      <div className="index-list mb-4 row">
        {[...Array(2).keys()].map((index) => (
          <Col md={6} key={index}>
            <Card className="d-flex align-items-center justify-content-center flex-row p-4 h-100">
              <CardBody>
                <CardTitle tag="h2" className="text-white w-100">
                  <Skeleton width="100%" />
                </CardTitle>
                <Skeleton width="25%" />
              </CardBody>
              <div className="p-4">
                <Skeleton height="170px" width="170px" className="rounded-circle" />
              </div>
            </Card>
          </Col>
        ))}
      </div>
    );
  }

  if (isError || !userStore.id) {
    <div className="index-list mb-4 row">
      <small className="text-muted center">
        {`Uhoh, we've hit an error.`}
        <code>{JSON.stringify(isError.info)}</code>
      </small>
    </div>;
  }

  return (
    <div className="index-list mb-4 row">
      {userStore.id && data.home &&
        data.home.map((element) => (
          <Col md={6} key={element.group.data.groupId.groupCode}>
            <Card className="d-flex align-items-center justify-content-center flex-row p-4 h-100">
              <CardBody>
                <CardTitle tag="h2" className="text-white">
                  {element.group.data.title.values[0].value}
                </CardTitle>
                <a href={`/group/${element.group.data.groupId.groupCode}`} className="btn btn-light">
                  Shop Now
                </a>
              </CardBody>
              <Image
                src={element && element.group && element.group.data && element.group.data.tag ? element.group.data.tag : ''}
                alt={`${element.group.data.title.values[0].value}`}
                objectFit="cover"
                width={200}
                height={200}
                className="rounded-circle"
              />
            </Card>
          </Col>
        ))}
    </div>
  );
};

export default HomeGroups;
