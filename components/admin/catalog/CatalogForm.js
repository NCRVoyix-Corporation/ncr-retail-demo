import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CategorySelect from '../categories/CategorySelect';
import useCatalogItem from '~/lib/swr/useCatalogItem';
import { Row, Col, Card, CardBody, Alert, Spinner, Button } from 'reactstrap';
import DatePicker from '../DatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import generateGUID from '~/lib/generateGUID';

const init = {
  itemId: '',
  shortDescription: '',
  longDescription: '',
  merchandiseCategory: '',
  status: '',
  departmentId: 'NA',
  nonMerchandise: false,
  price: '',
  currency: 'USD',
  effectiveDate: '',
  endDate: '',
  imageUrl: '',
  version: 1,
  groups: ''
};

const createItemSchema = Yup.object().shape({
  itemId: Yup.string().required('Item ID is required'),
  shortDescription: Yup.string().required('Short description is required'),
  longDescription: Yup.string().required('Long description is required'),
  // Need to update this required check to handle hidden field on change
  merchandiseCategory: Yup.string().required('Merchandise Category is required'),
  status: Yup.mixed().required('Status is required').oneOf(['INACTIVE', 'ACTIVE', 'DISCONTINUED', 'SEASONAL', 'TO_DISCONTINUE', 'UNAUTHORIZED']),
  departmentId: Yup.string(),
  nonMerchandise: Yup.boolean(),
  price: Yup.number().when('version', {
    is: (val) => val === 1,
    then: Yup.number().test(
      'is-decimal',
      'Input Valid Price',
      (value) => (value + '').match(/^(?!^0\.00$)(([1-9][\d]{0,6})|([0]))\.[\d]{2}$/) // needs to be updated, doesn't accept an ending 0
    )
  }),
  version: Yup.number().required('Version is required when updating catalog.'),
  unitOfMeasure: Yup.mixed().required('Unit of Measure is required').oneOf(['EA']),
  groups: Yup.string()
});

const CatalogForm = ({ id, categories }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [visible, setVisible] = useState(false);

  const onDismiss = () => setVisible(false);

  let { data, isLoading, isError } = useCatalogItem(id);
  const [initialValues, setInitialValues] = useState(init);
  if (id && !isLoading && !isError && initialValues.itemId === '') {
    const { departmentId, itemId, longDescription, nonMerchandise, shortDescription, status, version, groups } = data.catalogItem.data;
    let catalogValues = {
      version: version + 1,
      departmentId: departmentId ?? 'NA',
      itemId: itemId.itemCode,
      longDescription: longDescription ? longDescription.values[0].value : '',
      shortDescription: shortDescription ? shortDescription.values[0].value : '',
      merchandiseCategory: 'Drinks',
      nonMerchandise: nonMerchandise ?? false,
      status,
      groups
    };
    setInitialValues(catalogValues);
  }

  const [parentCategory, setParentCategory] = useState();

  const handleSubmit = async (values) => {
    let data = {};
    for (const key in values) {
      // Remove empty fields.
      if (values[key] !== '') {
        data[key] = values[key];
      }
      if (key === 'version') {
        data['version'] = values[key];
      }
    }

    data['dynamicAttributes'] = [
      {
        type: 'retail-item',
        attributes: [
          {
            key: 'ITEM_TYPE_CODE',
            value: '0'
          }
        ]
      }
    ];

    data['packageIdentifiers'] = [
      {
        type: '0',
        value: data['itemId']
      }
    ];

    data['departmentId'] = '02';

    delete data['itemId'];
    data['itemId'] = { itemCode: values['itemId'] };

    delete data['merchandiseCategory'];
    data['merchandiseCategory'] = { nodeId: values['merchandiseCategory'] };

    delete data['shortDescription'];
    data['shortDescription'] = {
      values: [
        {
          locale: 'en-us',
          value: values['shortDescription']
        }
      ]
    };

    delete data['longDescription'];
    data['longDescription'] = {
      values: [
        {
          locale: 'en-us',
          value: values['longDescription']
        }
      ]
    };

    if (id) {
      delete data['unitOfMeasure'];
      fetch(`/api/items/${id}`, { method: 'POST', body: JSON.stringify(data) })
        .then((res) => res.json())
        .then((data) => {
          if (data.response.status !== 204) {
            setShowAlert({
              status: data.response.status,
              message: data.response.data.message
            });
          } else {
            setShowAlert({
              status: 200,
              message: 'Item successfully updated.'
            });
          }
          setVisible(true);
        });
    } else {
      fetch('/api/items', { method: 'POST', body: JSON.stringify(data) })
        .then((response) => response.json())
        .then((data) => {
          let error = false;
          for (let key in data) {
            if (data[key].status !== 204) {
              if (data[key].status !== undefined) {
                setShowAlert({
                  status: data[key].status,
                  message: `You have encountered an error with status ${data[key].status}`
                });
                error = true;
              }
              // Add code here to deal with undefined response
            }
          }
          if (!error) {
            setShowAlert({
              status: 200,
              message: 'Item successfully created and added to catalog.'
            });
          }
          setVisible(true);
        });
    }
  };

  return (
    <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={createItemSchema} onSubmit={handleSubmit}>
      {(formik) => {
        const { errors, touched, isValid, dirty, setFieldTouched, setFieldValue } = formik;
        useEffect(() => {
          initialValues.merchandiseCategory = parentCategory;
          setFieldValue('merchandiseCategory', parentCategory);
          setFieldTouched('merchandiseCategory', true);
        }, [parentCategory]);
        return (
          <main className="my-4">
            <Form>
              {id && (
                <Alert isOpen={true} color="warning">
                  Item ID, price and attributes are unable to be edited on a global level.
                </Alert>
              )}
              {isLoading && (
                <div className="my-4 d-flex justify-content-center">
                  <Spinner color="primary" />
                </div>
              )}
              <Alert toggle={onDismiss} isOpen={visible} className="my-4" color={showAlert.status == 200 ? 'success' : 'danger'}>
                {showAlert.message}
              </Alert>
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{id ? 'Edit' : 'Create'} Item</h1>
                <div className="form-group float-right">
                  <button type="submit" className={`${!(dirty && isValid) ? 'disabled' : ''} btn btn-primary`} disabled={`${!(dirty && isValid) ? 'disabled' : ''}`}>
                    {' '}
                    {id ? '+ Update' : '+ Create'} Item
                  </button>
                </div>
              </div>

              <Row>
                <Col md="8">
                  <Card className="mb-3">
                    <CardBody>
                      <div className="form-group">
                        <label htmlFor="shortDescription">Title*</label>
                        <Field
                          name="shortDescription"
                          id="shortDescription"
                          placeholder="Item Name"
                          className={`${errors.shortDescription && touched.shortDescription ? 'is-invalid' : null} form-control`}
                        />
                        <ErrorMessage name="shortDescription" component="div" className="invalid-feedback" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="longDescription">Long Description*</label>
                        <Field
                          as="textarea"
                          rows="4"
                          name="longDescription"
                          id="longDescription"
                          className={`${errors.longDescription && touched.longDescription ? 'is-invalid' : null} form-control`}
                        />
                        <ErrorMessage name="longDescription" component="div" className="invalid-feedback" />
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="mb-3">
                    <CardBody>
                      <div className="form-group">
                        <label htmlFor="imageUrl">Image Url</label>
                        <Field
                          name="imageUrl"
                          id="imageUrl"
                          placeholder="https://..."
                          className={`${errors.imageUrl && touched.imageUrl ? 'is-invalid' : null} form-control`}
                          disabled={id ? 'disabled' : ''}
                        />
                        <ErrorMessage name="imageUrl" component="div" className="invalid-feedback" />
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="mb-3">
                    {!id ? (
                      <CardBody>
                        <div className="form-row">
                          <div className="form-group col-md-4">
                            <label htmlFor="price">Price</label>
                            <Field name="price" id="price" className={`${errors.price && touched.price ? 'is-invalid' : null} form-control`} />
                            <ErrorMessage name="price" component="div" className="invalid-feedback" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="currency">Currency</label>
                            <Field as="select" name="currency" className={`${errors.currency && touched.currency ? 'is-invalid' : null} form-control`}>
                              <option value="USD">USD</option>
                            </Field>
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group col-md-4">
                            <label htmlFor="effectiveDate">Effective Date*</label>
                            <DatePicker name="effectiveDate" />
                          </div>
{/*
                          <div className="form-group col-md-4">
                            <label htmlFor="endDate">End Date</label>
                            <DatePicker name="endDate" />
                          </div>
*/}
                        </div>
                      </CardBody>
                    ) : (
                      <CardBody>Price cannot be updated on a global level after creation. Prices are updated on each individual site.</CardBody>
                    )}
                  </Card>
                </Col>
                <Col md="4">
                  <Card className="mb-3">
                    <CardBody>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label htmlFor="version">Version*</label>
                          <Field name="version" id="version" className={`${errors.version && touched.version ? 'is-invalid' : null} form-control`} />
                          <ErrorMessage name="version" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-12">
                          <label htmlFor="itemId">Item ID*</label>
                          <Field name="itemId" id="itemId" className={`${errors.itemId && touched.itemId ? 'is-invalid' : null} form-control`} disabled={id ? 'disabled' : ''} />
                          <ErrorMessage name="itemId" component="div" className="invalid-feedback" />
                          <Button onClick={() => setFieldValue('itemId', generateGUID())} color="link" className="m-0 p-0">
                            Generate
                          </Button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="status">Status*</label>
                        <Field as="select" name="status" className={`${errors.status && touched.status ? 'is-invalid' : null} form-control`}>
                          <option>--</option>
                          <option value="ACTIVE" label="Active" />
                          <option value="INACTIVE" label="Inactive" />
                          <option value="DISCONTINUED" label="Discontinue" />
                          <option value="SEASONAL" label="Seasonal" />
                          <option value="TO_DISCONTINUE" label="To Discontinue" />
                          <option value="UNAUTHORIZED" label="Unauthorized" />
                        </Field>
                        <ErrorMessage name="status" component="div" className="invalid-feedback" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="status">Unit of Measure*</label>
                        <Field as="select" name="unitOfMeasure" className={`${errors.unitOfMeasure && touched.unitOfMeasure ? 'is-invalid' : null} form-control`}>
                          <option>--</option>
                          <option value="EA" label="Each" />
                        </Field>
                        <ErrorMessage name="status" component="div" className="invalid-feedback" />
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="mb-3">
                    <CardBody>
                      <Field name="merchandiseCategory" id="merchandiseCategory" className="d-none" value={parentCategory || ''} />
                      <CategorySelect
                        currentCategory={initialValues.merchandiseCategory}
                        initialCategory={initialValues.parentCategory ?? ''}
                        setDisabled={false}
                        setParentCategory={setParentCategory}
                        categories={categories}
                      />
                    </CardBody>
                  </Card>
                  <Card className="mb-3">
                    <CardBody>
                      <div className="form-group">
                        <label htmlFor="groups">Group</label>
                        <Field name="groups" id="groups" className={`${errors.groups && touched.groups ? 'is-invalid' : null} form-control`} disabled={id ? 'disabled' : ''} />
                        <ErrorMessage name="groups" component="div" className="invalid-feedback" />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Form>
          </main>
        );
      }}
    </Formik>
  );
};

export default CatalogForm;
