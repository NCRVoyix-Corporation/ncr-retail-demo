import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CategorySelect from './CategorySelect';
import * as Yup from 'yup';
import useCategory from '~/lib/swr/useCategory';
import { Button, Alert, Spinner } from 'reactstrap';
import generateGUID from '~/lib/generateGUID';

const init = {
  title: '',
  nodeCode: '',
  tag: '',
  departmentNode: null,
  departmentSale: null,
  status: '',
  parentCategory: '',
  version: 1
};

const createCategorySchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  nodeCode: Yup.string().required('Node code is required'),
  tag: Yup.string(),
  departmentNode: Yup.boolean().nullable(),
  departmentSale: Yup.boolean().nullable(),
  status: Yup.mixed().required('Status is required').oneOf(['INACTIVE', 'ACTIVE', 'DISCONTINUED', 'SEASONAL', 'TO_DISCONTINUE', 'UNAUTHORIZED']),
  parentCategory: Yup.string(), //todo this validation
  version: Yup.number().required('Version is required when updating category.')
});

const CategoryForm = ({ categoryId, categoryNodes }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [visible, setVisible] = useState(false);

  const onDismiss = () => setVisible(false);
  let { category, isLoading, isError } = useCategory(categoryId);
  const [initialValues, setInitialValues] = useState(init);
  if (categoryId && !isLoading && !isError && initialValues.nodeCode === '') {
    const { response } = category;
    const { data } = response;
    const { departmentNode, departmentSale, nodeCode, status, tag, version, title, parentId } = data;
    let categoryValues = {
      version: version + 1,
      nodeCode,
      tag: tag ?? '',
      departmentNode: departmentNode ?? null,
      departmentSale: departmentSale ?? null,
      status,
      title: title.values[0].value, // this should beupdated for locales?
      parentCategory: parentId ? parentId.nodeId : ''
    };
    setInitialValues(categoryValues);
  }
  const [parentCategory, setParentCategory] = useState();

  const handleSubmit = async (values) => {
    if (values['parentCategory'] === '' && parentCategory) {
      values['parentCategory'] = parentCategory;
    }

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
    let title = data['title'];
    // Doesn't support multi-lang right now.
    data['title'] = {
      values: [
        {
          locale: 'en-US',
          value: title
        }
      ]
    };

    if (data['parentCategory']) {
      data['parentId'] = {
        nodeId: data['parentCategory']
      };
      delete data['parentCategory'];
    }
    data['nodeId'] = {
      nodeId: data['nodeCode']
    };
    let nodes = { nodes: [data] };
    if (categoryId) {
      fetch(`/api/category/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(nodes)
      })
        .then((response) => {
          if (!(response.status === 204 || response.status === 200)) {
            setShowAlert({
              status: response.status,
              message: response.data.message
            });
          } else {
            setShowAlert({
              status: 200,
              message: 'Category successfully updated.'
            });
          }
          setVisible(true);
        });
    } else {
      fetch(`/api/category`, { 
        method: 'PUT', 
        body: JSON.stringify(nodes) 
      })
          .then((response) => {
            if (response.status !== 204) {
              setShowAlert({
                status: response.status, 
                message: response.data.message
              });
            } else {
              setShowAlert({
                status: 200, 
                message: 'Category successfully created.'
              });
            }
            setVisible(true);
          });
    }
  };

  return (
    <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={createCategorySchema} onSubmit={handleSubmit}>
      {(formik) => {
        const { errors, touched, isValid, dirty, setFieldValue } = formik;
        return (
          <Form className="my-4">
            {isLoading && (
              <div className="my-4 d-flex justify-content-center">
                <Spinner color="primary" />
              </div>
            )}
            <Alert toggle={onDismiss} isOpen={visible} className="my-4" color={showAlert.status == 200 ? 'success' : 'danger'}>
              {showAlert.message}
            </Alert>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">{categoryId ? 'Edit' : 'Create'} Category</h1>
              <div className="form-group float-right">
                <button type="submit" className={`${!(dirty && isValid) ? 'disabled' : ''} btn btn-primary`} disabled={`${!(dirty && isValid) ? 'disabled' : ''}`}>
                  {' '}
                  {categoryId ? '+ Update' : '+ Create'} Category
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="title">Title*</label>
                        <Field name="title" id="title" className={`${errors.title && touched.title ? 'is-invalid' : null} form-control`} />
                        <ErrorMessage name="title" component="div" className="invalid-feedback" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="tag">Tag</label>
                      <Field name="tag" id="tag" className={`${errors.tag && touched.tag ? 'is-invalid' : null} form-control`} />
                      <ErrorMessage name="tag" component="div" className="invalid-feedback" />
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group form-check">
                          <Field type="checkbox" name="departmentNode" id="departmentNode" className={`${errors.departmentNode && touched.departmentNode ? 'is-invalid' : null} form-check-input`} />
                          <ErrorMessage name="departmentNode" component="div" className="invalid-feedback" />
                          <label className="form-check-label" htmlFor="departmentNode">
                            Department Node
                          </label>
                          <small id="departmentNode" className="form-text text-muted">
                            Indicates if this node represents a department
                          </small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <div className="form-check">
                            <Field type="checkbox" name="departmentSale" id="departmentSale" className={`${errors.departmentSale && touched.departmentSale ? 'is-invalid' : null} form-check-input`} />
                            <ErrorMessage name="departmentNode" component="div" className="invalid-feedback" />
                            <label className="form-check-label" htmlFor="departmentSale">
                              Department Sale
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="nodeCode">Node Code</label>
                      <Field name="nodeCode" id="nodeCode" className={`${errors.nodeCode && touched.nodeCode ? 'is-invalid' : null} form-control`} disabled={categoryId ? 'disabled' : ''} />
                      <ErrorMessage name="nodeCode" component="div" className="invalid-feedback" />
                      <Button onClick={() => setFieldValue('nodeCode', generateGUID())} color="link" className="m-0 p-0">
                        Generate
                      </Button>
                    </div>
                    <div className="form-group">
                      <label htmlFor="version">Version</label>
                      <Field name="version" id="version" className={`${errors.version && touched.version ? 'is-invalid' : null} form-control`} />
                      <ErrorMessage name="version" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="status" className="h5">
                        Status
                      </label>
                      <Field as="select" name="status" className={`${errors.status && touched.status ? 'is-invalid' : null} form-control`}>
                        <option value="" label="--" />
                        <option value="ACTIVE" label="ACTIVE" />
                        <option value="INACTIVE" label="INACTIVE" />
                        <option value="DISCONTINUED" label="DISCONTINUED" />
                        <option value="SEASONAL" label="SEASONAL" />
                        <option value="TO_DISCONTINUE" label="TO_DISCONTINUE" />
                        <option value="UNAUTHORIZED" label="UNAUTHORIZED" />
                      </Field>
                      <ErrorMessage name="status" component="div" className="invalid-feedback" />
                    </div>
                    {categoryNodes.length > 0 && (
                      <CategorySelect
                        currentCategory={initialValues.nodeCode}
                        initialCategory={initialValues.parentCategory ?? ''}
                        setDisabled={!!(initialValues.parentCategory || categoryId)}
                        setParentCategory={setParentCategory}
                        categories={categoryNodes}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CategoryForm;
