import React from 'react';

const StyleDemo = () => {
  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12">
          <h1 className="display-4 mb-4 text-center">CivicChain UI Components</h1>
          <p className="lead text-center">Using pure Bootstrap 5 styling</p>
        </div>
      </div>

      {/* Cards Section */}
      <section className="mb-5">
        <h2 className="border-bottom pb-2 mb-4">Cards</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">Community Service</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Participate in local community service events to earn civic points.</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-success">50 Points</span>
                  <small className="text-muted">2 hours</small>
                </div>
              </div>
              <div className="card-footer bg-white border-top">
                <button className="btn btn-sm btn-outline-primary">View Details</button>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0">Environmental</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Join our tree planting initiative and help improve the local environment.</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-success">75 Points</span>
                  <small className="text-muted">3 hours</small>
                </div>
              </div>
              <div className="card-footer bg-white border-top">
                <button className="btn btn-sm btn-outline-success">View Details</button>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-info text-white">
                <h5 className="card-title mb-0">Education</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Volunteer as a tutor for underprivileged students in your community.</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-success">100 Points</span>
                  <small className="text-muted">4 hours</small>
                </div>
              </div>
              <div className="card-footer bg-white border-top">
                <button className="btn btn-sm btn-outline-info">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="mb-5">
        <h2 className="border-bottom pb-2 mb-4">Buttons</h2>
        <div className="row mb-4">
          <div className="col-12">
            <button className="btn btn-primary me-2 mb-2">Primary</button>
            <button className="btn btn-secondary me-2 mb-2">Secondary</button>
            <button className="btn btn-success me-2 mb-2">Success</button>
            <button className="btn btn-danger me-2 mb-2">Danger</button>
            <button className="btn btn-warning me-2 mb-2">Warning</button>
            <button className="btn btn-info me-2 mb-2">Info</button>
            <button className="btn btn-light me-2 mb-2">Light</button>
            <button className="btn btn-dark me-2 mb-2">Dark</button>
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-12">
            <button className="btn btn-outline-primary me-2 mb-2">Primary</button>
            <button className="btn btn-outline-secondary me-2 mb-2">Secondary</button>
            <button className="btn btn-outline-success me-2 mb-2">Success</button>
            <button className="btn btn-outline-danger me-2 mb-2">Danger</button>
            <button className="btn btn-outline-warning me-2 mb-2">Warning</button>
            <button className="btn btn-outline-info me-2 mb-2">Info</button>
            <button className="btn btn-outline-light me-2 mb-2">Light</button>
            <button className="btn btn-outline-dark me-2 mb-2">Dark</button>
          </div>
        </div>
      </section>

      {/* Alerts Section */}
      <section className="mb-5">
        <h2 className="border-bottom pb-2 mb-4">Alerts</h2>
        <div className="alert alert-primary" role="alert">
          A simple primary alert with <a href="#" className="alert-link">an example link</a>.
        </div>
        <div className="alert alert-success" role="alert">
          A simple success alert with <a href="#" className="alert-link">an example link</a>.
        </div>
        <div className="alert alert-danger" role="alert">
          A simple danger alert with <a href="#" className="alert-link">an example link</a>.
        </div>
        <div className="alert alert-warning" role="alert">
          A simple warning alert with <a href="#" className="alert-link">an example link</a>.
        </div>
      </section>

      {/* Form Section */}
      <section className="mb-5">
        <h2 className="border-bottom pb-2 mb-4">Forms</h2>
        <div className="row">
          <div className="col-md-6">
            <form>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </section>

      {/* Tables Section */}
      <section className="mb-5">
        <h2 className="border-bottom pb-2 mb-4">Tables</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Activity</th>
                <th scope="col">Category</th>
                <th scope="col">Points</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Community Clean-up</td>
                <td>Environmental</td>
                <td>50</td>
                <td><span className="badge bg-success">Completed</span></td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Voter Registration Drive</td>
                <td>Governance</td>
                <td>75</td>
                <td><span className="badge bg-warning">Pending</span></td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Food Bank Volunteer</td>
                <td>Community Service</td>
                <td>100</td>
                <td><span className="badge bg-primary">In Progress</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default StyleDemo; 